const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5003;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY?.trim();

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "nousresearch/deephermes-3-mistral-24b-preview:free",
        messages: [
          { role: "system", content: "You are an agricultural expert assistant." },
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://agrolens-farmers.com',
          'X-Title': 'AgroLens'
        }
      }
    );

    const message = response.data?.choices?.[0]?.message?.content;
    if (message) {
      res.json({ success: true, message });
    } else {
      throw new Error('No valid response from OpenRouter');
    }

  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Failed to get response from AI service' });
  }
});

app.get('/', (req, res) => {
  res.send('Chatbot backend is running!');
});

app.listen(PORT, () => {
  console.log(`✅ Chatbot server running at http://localhost:${PORT}`);
});
