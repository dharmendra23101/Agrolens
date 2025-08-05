import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getContactMessages, deleteContactMessage, markMessageAsRead } from '../services/adminService';
import Translatable from '../components/Translatable';

function AdminDashboard() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await getContactMessages();
        setMessages(data);
        setError('');
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Delete a message
  const handleDeleteMessage = async (id) => {
    try {
      await deleteContactMessage(id);
      setMessages(messages.filter(message => message.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Failed to delete message. Please try again.');
    }
  };

  // Mark message as read
  const handleMarkAsRead = async (id) => {
    try {
      await markMessageAsRead(id);
      setMessages(messages.map(message => 
        message.id === id ? { ...message, status: 'read' } : message
      ));
    } catch (err) {
      console.error('Error marking message as read:', err);
      setError('Failed to update message status. Please try again.');
    }
  };

  // View message details
  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    if (message.status === 'unread') {
      handleMarkAsRead(message.id);
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  // Filter messages
  const filteredMessages = filterStatus === 'all' 
    ? messages 
    : messages.filter(message => message.status === filterStatus);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1><Translatable>Admin Dashboard</Translatable></h1>
        <p><Translatable>Manage contact messages from users</Translatable></p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="dashboard-content">
        <div className="message-filters">
          <button 
            className={filterStatus === 'all' ? 'active' : ''} 
            onClick={() => setFilterStatus('all')}
          >
            <Translatable>All Messages</Translatable> ({messages.length})
          </button>
          <button 
            className={filterStatus === 'unread' ? 'active' : ''} 
            onClick={() => setFilterStatus('unread')}
          >
            <Translatable>Unread</Translatable> ({messages.filter(m => m.status === 'unread').length})
          </button>
          <button 
            className={filterStatus === 'read' ? 'active' : ''} 
            onClick={() => setFilterStatus('read')}
          >
            <Translatable>Read</Translatable> ({messages.filter(m => m.status === 'read').length})
          </button>
        </div>

        <div className="messages-container">
          <div className="messages-list">
            <h2><Translatable>Messages</Translatable></h2>
            
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="empty-state">
                <p><Translatable>No messages found</Translatable></p>
              </div>
            ) : (
              <div className="messages">
                {filteredMessages.map(message => (
                  <div 
                    key={message.id} 
                    className={`message-item ${message.status === 'unread' ? 'unread' : ''} ${selectedMessage?.id === message.id ? 'selected' : ''}`}
                    onClick={() => handleViewMessage(message)}
                  >
                    <div className="message-header">
                      <div className="message-sender">
                        <strong>{message.name}</strong>
                        {message.status === 'unread' && <span className="unread-badge"></span>}
                      </div>
                      <div className="message-date">{formatDate(message.createdAt)}</div>
                    </div>
                    <div className="message-subject">{message.subject}</div>
                    <div className="message-preview">
                      {message.message.substring(0, 60)}
                      {message.message.length > 60 ? '...' : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="message-detail">
            {selectedMessage ? (
              <div className="detail-content">
                <div className="detail-header">
                  <h2>{selectedMessage.subject}</h2>
                  <div className="detail-actions">
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                    >
                      <Translatable>Delete</Translatable>
                    </button>
                  </div>
                </div>
                
                <div className="detail-info">
                  <div className="info-item">
                    <span className="info-label"><Translatable>From</Translatable>:</span> 
                    <span>{selectedMessage.name} ({selectedMessage.email})</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><Translatable>Date</Translatable>:</span> 
                    <span>{formatDate(selectedMessage.createdAt)}</span>
                  </div>
                </div>
                
                <div className="detail-message">
                  <p>{selectedMessage.message}</p>
                </div>
                
                {selectedMessage.userId && (
                  <div className="user-info">
                    <div className="info-label"><Translatable>Sent by registered user</Translatable>:</div>
                    <div className="user-id">{selectedMessage.userId}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-detail">
                <p><Translatable>Select a message to view details</Translatable></p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 1rem 4rem;
        }
        
        .dashboard-header {
          margin-bottom: 2rem;
        }
        
        .dashboard-header h1 {
          font-size: 2rem;
          color: #2f855a;
          margin-bottom: 0.5rem;
        }
        
        .dashboard-header p {
          color: #4a5568;
        }
        
        .error-message {
          padding: 1rem;
          background-color: #fff5f5;
          border: 1px solid #fed7d7;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }
        
        .error-message p {
          color: #c53030;
          margin: 0;
        }
        
        .dashboard-content {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }
        
        .message-filters {
          display: flex;
          padding: 1rem;
          background-color: #f9fafb;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .message-filters button {
          background: none;
          border: none;
          padding: 0.5rem 1rem;
          margin-right: 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          color: #4a5568;
          transition: all 0.2s ease;
        }
        
        .message-filters button:hover {
          background-color: #edf2f7;
        }
        
        .message-filters button.active {
          background-color: #2f855a;
          color: white;
        }
        
        .messages-container {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          min-height: 500px;
        }
        
        @media (max-width: 768px) {
          .messages-container {
            grid-template-columns: 1fr;
          }
        }
        
        .messages-list {
          border-right: 1px solid #e2e8f0;
          overflow-y: auto;
          max-height: 600px;
        }
        
        .messages-list h2 {
          padding: 1rem;
          margin: 0;
          font-size: 1.25rem;
          color: #2d3748;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(47, 133, 90, 0.2);
          border-radius: 50%;
          border-top-color: #2f855a;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .empty-state {
          padding: 2rem;
          text-align: center;
          color: #718096;
        }
        
        .messages {
          display: flex;
          flex-direction: column;
        }
        
        .message-item {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .message-item:hover {
          background-color: #f7fafc;
        }
        
        .message-item.selected {
          background-color: #e6fffa;
        }
        
        .message-item.unread {
          background-color: #f0fff4;
        }
        
        .message-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        
        .message-sender {
          display: flex;
          align-items: center;
        }
        
        .unread-badge {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #2f855a;
          margin-left: 0.5rem;
        }
        
        .message-date {
          font-size: 0.75rem;
          color: #718096;
        }
        
        .message-subject {
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #2d3748;
        }
        
        .message-preview {
          font-size: 0.875rem;
          color: #718096;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .message-detail {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }
        
        .empty-detail {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          color: #a0aec0;
          text-align: center;
        }
        
        .detail-content {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }
        
        .detail-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #2d3748;
          word-break: break-word;
        }
        
        .detail-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .delete-button {
          background-color: #e53e3e;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .delete-button:hover {
          background-color: #c53030;
        }
        
        .detail-info {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .info-item {
          margin-bottom: 0.5rem;
        }
        
        .info-label {
          font-weight: 500;
          color: #4a5568;
        }
        
        .detail-message {
          flex: 1;
          line-height: 1.6;
          color: #2d3748;
        }
        
        .detail-message p {
          white-space: pre-wrap;
          word-break: break-word;
        }
        
        .user-info {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
          font-size: 0.875rem;
        }
        
        .user-id {
          font-family: monospace;
          background-color: #f7fafc;
          padding: 0.5rem;
          border-radius: 4px;
          margin-top: 0.5rem;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;