import { db } from "./firebaseConfig";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  Timestamp,
  where
} from "firebase/firestore";

// Collection names
const ADMINS_COLLECTION = "admins";
const CONTACT_MESSAGES_COLLECTION = "contactMessages";

// Check if a user is an admin
export const checkIfUserIsAdmin = async (uid) => {
  if (!uid) return false;
  
  try {
    console.log("Checking admin status for:", uid);
    const adminRef = doc(db, ADMINS_COLLECTION, uid);
    const adminDoc = await getDoc(adminRef);
    const isAdmin = adminDoc.exists() && adminDoc.data().isAdmin === true;
    console.log("Admin status:", isAdmin);
    return isAdmin;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Add a user as admin (should be called by an existing admin)
export const addAdminUser = async (uid, adminData = {}) => {
  try {
    const adminRef = doc(db, ADMINS_COLLECTION, uid);
    await setDoc(adminRef, {
      isAdmin: true,
      createdAt: Timestamp.now(),
      ...adminData
    });
    return true;
  } catch (error) {
    console.error("Error adding admin:", error);
    throw error;
  }
};

// Remove admin privileges
export const removeAdminUser = async (uid) => {
  try {
    const adminRef = doc(db, ADMINS_COLLECTION, uid);
    await deleteDoc(adminRef);
    return true;
  } catch (error) {
    console.error("Error removing admin:", error);
    throw error;
  }
};

// Save a contact message to Firestore
export const saveContactMessage = async (messageData) => {
  try {
    const messagesRef = collection(db, CONTACT_MESSAGES_COLLECTION);
    const newMessage = {
      ...messageData,
      createdAt: Timestamp.now(),
      status: "unread"
    };
    
    await setDoc(doc(messagesRef), newMessage);
    return true;
  } catch (error) {
    console.error("Error saving contact message:", error);
    throw error;
  }
};

// Get all contact messages (for admin)
export const getContactMessages = async () => {
  try {
    const messagesQuery = query(
      collection(db, CONTACT_MESSAGES_COLLECTION),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(messagesQuery);
    const messages = [];
    
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      });
    });
    
    return messages;
  } catch (error) {
    console.error("Error getting contact messages:", error);
    throw error;
  }
};

// Delete a contact message
export const deleteContactMessage = async (messageId) => {
  try {
    const messageRef = doc(db, CONTACT_MESSAGES_COLLECTION, messageId);
    await deleteDoc(messageRef);
    return true;
  } catch (error) {
    console.error("Error deleting contact message:", error);
    throw error;
  }
};

// Mark message as read
export const markMessageAsRead = async (messageId) => {
  try {
    const messageRef = doc(db, CONTACT_MESSAGES_COLLECTION, messageId);
    await setDoc(messageRef, { status: "read" }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
};

// Get unread message count
export const getUnreadMessageCount = async () => {
  try {
    const messagesQuery = query(
      collection(db, CONTACT_MESSAGES_COLLECTION),
      where("status", "==", "unread")
    );
    
    const querySnapshot = await getDocs(messagesQuery);
    return querySnapshot.size;
  } catch (error) {
    console.error("Error counting unread messages:", error);
    throw error;
  }
};