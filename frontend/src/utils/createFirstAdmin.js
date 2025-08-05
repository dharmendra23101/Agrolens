// IMPORTANT: Use this script only once to create the first admin
// You should delete this file after initial setup

import { db } from "../services/firebaseConfig";
import { doc, setDoc, Timestamp } from "firebase/firestore";

// Replace with your admin user's UID from Firebase Auth
const ADMIN_UID = "YOUR_ADMIN_USER_UID"; 

const createFirstAdmin = async () => {
  try {
    const adminRef = doc(db, "admins", ADMIN_UID);
    await setDoc(adminRef, {
      isAdmin: true,
      createdAt: Timestamp.now(),
      note: "Initial admin user"
    });
    console.log("Admin user created successfully!");
    return true;
  } catch (error) {
    console.error("Error creating admin user:", error);
    return false;
  }
};

export default createFirstAdmin;
