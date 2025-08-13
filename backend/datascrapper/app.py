from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timezone, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

FIREBASE_URL = os.getenv("FIREBASE_URL")  # should end with .json
URL = os.getenv("URL")  # target website URL to scrape
SCRAPER_LINK = os.getenv("SCRAPER_LINK")  # optional reference link

def scrape_ministry_major_schemes():
    """Scrape agricultural schemes from the ministry website."""
    try:
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/138.0.0.0 Safari/537.36"
            )
        }

        response = requests.get(URL, headers=headers, timeout=15)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")
        schemes = []

        table = soup.find("table")
        if not table:
            print("No table found on target page.")
            return []

        rows = table.find_all("tr")[1:]  # skip header
        for row in rows:
            cols = row.find_all("td")
            if len(cols) < 3:
                continue

            title = cols[1].get_text(strip=True)
            date = cols[2].get_text(strip=True)

            pdf_link = None
            for link in row.find_all("a", href=True):
                href = link["href"]
                full_link = href if href.startswith("http") else f"https://agriwelfare.gov.in{href}"
                if href.lower().endswith(".pdf"):
                    pdf_link = full_link

            schemes.append({
                "title": title,
                "publish_date": date,
                "pdf_link": pdf_link,
                "website_link": SCRAPER_LINK,
                "source_website": URL
            })
        return schemes
    except Exception as e:
        print("Scraping error:", e)
        return []

def get_firebase_data():
    """Retrieve existing data from Firebase."""
    try:
        res = requests.get(FIREBASE_URL, timeout=10)
        if res.status_code == 200:
            return res.json()
    except Exception as e:
        print("Firebase get error:", e)
    return None

def upload_to_firebase(data):
    """Upload scraped data to Firebase."""
    payload = {
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "schemes": data
    }
    try:
        res = requests.put(FIREBASE_URL, json=payload, timeout=10)
        res.raise_for_status()
        print("Firebase upload successful.")
    except Exception as e:
        print("Firebase upload error:", e)

@app.route("/run-scraper", methods=["GET"])
def run_scraper():
    """Scrape and update Firebase only if data is missing or older than 12 hours."""
    firebase_data = get_firebase_data()
    needs_update = True

    if firebase_data and "last_updated" in firebase_data:
        try:
            last_updated = datetime.fromisoformat(firebase_data["last_updated"].replace("Z", "+00:00"))
            age_hours = (datetime.now(timezone.utc) - last_updated).total_seconds() / 3600
            print(f"Last update was {age_hours:.2f} hours ago.")
            if age_hours < 12:
                needs_update = False
        except Exception as e:
            print("Date parse error:", e)

    # Only scrape if needed
    if needs_update:
        print("Scraping fresh data...")
        scraped_data = scrape_ministry_major_schemes()
        if scraped_data:
            upload_to_firebase(scraped_data)
            return jsonify({"status": "updated", "count": len(scraped_data)})
        else:
            return jsonify({"status": "error", "message": "Scraping failed"}), 500

    return jsonify({"status": "no_update_needed"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
