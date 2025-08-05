import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

function AdminCheck() {
  const { currentUser, isAdmin } = useAuth();
  const [adminDocData, setAdminDocData] = useState(null);
  const [adminExists, setAdminExists] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAdminDirectly = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        console.log("Checking admin document for:", currentUser.uid);
        const adminRef = doc(db, 'admins', currentUser.uid);
        const adminDoc = await getDoc(adminRef);
        
        setAdminExists(adminDoc.exists());
        if (adminDoc.exists()) {
          setAdminDocData(adminDoc.data());
        }
      } catch (err) {
        console.error("Error fetching admin document:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAdminDirectly();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="admin-check">
        <h2>Admin Status Check</h2>
        <p>You need to be logged in to check admin status.</p>
      </div>
    );
  }

  return (
    <div className="admin-check">
      <h2>Admin Status Check</h2>
      
      <div className="info-section">
        <h3>User Info:</h3>
        <p><strong>Email:</strong> {currentUser.email}</p>
        <p><strong>UID:</strong> {currentUser.uid}</p>
        <p><strong>isAdmin from Context:</strong> {isAdmin ? "Yes" : "No"}</p>
      </div>
      
      {loading ? (
        <p>Loading admin document...</p>
      ) : error ? (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      ) : (
        <div className="admin-doc-section">
          <h3>Admin Document Check:</h3>
          <p><strong>Admin Document Exists:</strong> {adminExists ? "Yes" : "No"}</p>
          
          {adminExists && adminDocData && (
            <div className="admin-data">
              <h4>Admin Document Data:</h4>
              <pre>{JSON.stringify(adminDocData, null, 2)}</pre>
              
              <p><strong>isAdmin field value:</strong> {adminDocData.isAdmin ? "true" : "false"}</p>
            </div>
          )}
        </div>
      )}
      
      <div className="troubleshooting">
        <h3>Troubleshooting Steps:</h3>
        <ol>
          <li>Make sure the admin document ID matches your user UID exactly</li>
          <li>Verify that the admin document has an <code>isAdmin: true</code> field</li>
          <li>Check that you're importing <code>isAdmin</code> from the auth context in your Navbar</li>
          <li>Ensure your Firestore security rules allow reading the admin document</li>
          <li>Try logging out and logging back in</li>
        </ol>
      </div>
      
      <style jsx>{`
        .admin-check {
          max-width: 800px;
          margin: 40px auto;
          padding: 20px;
          background-color: #f9fafb;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        h2 {
          color: #2f855a;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 10px;
        }
        
        h3 {
          color: #4a5568;
          margin-top: 20px;
        }
        
        .info-section, .admin-doc-section {
          background-color: white;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        
        .admin-data {
          background-color: #edf2f7;
          padding: 15px;
          border-radius: 4px;
          margin-top: 10px;
        }
        
        pre {
          background-color: #2d3748;
          color: #e2e8f0;
          padding: 10px;
          border-radius: 4px;
          overflow-x: auto;
        }
        
        .error-message {
          background-color: #fed7d7;
          color: #c53030;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        
        .troubleshooting {
          background-color: #e6fffa;
          padding: 15px;
          border-radius: 6px;
        }
        
        ol {
          padding-left: 20px;
        }
        
        li {
          margin-bottom: 8px;
        }
        
        code {
          background-color: #edf2f7;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
}

export default AdminCheck;