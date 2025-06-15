import React from 'react';
import {
  ChatBubble as ChatIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Store as StoreIcon,
  Business as BusinessIcon,
  AccountBalance as BankIcon,
  Close as CloseIcon,
  Add as AddIcon
} from '@mui/icons-material';

const LOAN_CATEGORIES = {
  property: { icon: <BusinessIcon />, color: '#4CAF50', label: 'Property Loans' },
  home: { icon: <HomeIcon />, color: '#2196F3', label: 'Home Loans' },
  shop: { icon: <StoreIcon />, color: '#FF9800', label: 'Shop Loans' },
  business: { icon: <BankIcon />, color: '#9C27B0', label: 'Business Loans' },
};

function ChatHistory({ chats, onSelectChat, onDeleteChat, activeChat, isOpen, onClose, onNewChat }) {
  const getCategoryFromTitle = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('property')) return 'property';
    if (lowerTitle.includes('home')) return 'home';
    if (lowerTitle.includes('shop')) return 'shop';
    return 'business';
  };

  const groupChatsByCategory = () => {
    const groups = {};
    Object.keys(LOAN_CATEGORIES).forEach(category => {
      groups[category] = chats.filter(chat => getCategoryFromTitle(chat.title) === category);
    });
    return groups;
  };

  const chatGroups = groupChatsByCategory();

  return (
    <div className={`chat-history-panel ${isOpen ? 'open' : ''}`}>
      <div className="chat-history-header">
        <h2>Loan Assistant</h2>
        <div className="history-header-controls">
          <button 
            className="new-chat-history-button" 
            onClick={onNewChat}
            title="Start New Chat"
          >
            <AddIcon fontSize="small" />
          </button>
          <button 
            className="close-history-button" 
            onClick={onClose}
            title="Close History"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
      
      <div className="chat-history-content">
        {chats.length === 0 ? (
          <div className="empty-history">
            <ChatIcon sx={{ fontSize: 48, color: 'var(--text-secondary)' }} />
            <p>No chat history yet</p>
            <button className="start-chat-button" onClick={onNewChat}>
              <AddIcon fontSize="small" />
              Start New Chat
            </button>
          </div>
        ) : (
          Object.entries(chatGroups).map(([category, categoryChats]) => (
            categoryChats.length > 0 && (
              <div key={category} className="chat-category-group">
                <div className="category-header" style={{ color: LOAN_CATEGORIES[category].color }}>
                  {LOAN_CATEGORIES[category].icon}
                  <span>{LOAN_CATEGORIES[category].label}</span>
                </div>
                {categoryChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`chat-history-item ${activeChat?.id === chat.id ? 'active' : ''}`}
                    onClick={() => onSelectChat(chat)}
                  >
                    <div className="chat-icon" style={{ color: LOAN_CATEGORIES[category].color }}>
                      <ChatIcon />
                    </div>
                    <div className="chat-info">
                      <div className="chat-title">{chat.title}</div>
                      <div className="chat-preview">{chat.lastMessage}</div>
                      <div className="chat-timestamp">
                        {new Date(chat.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <button
                      className="delete-chat"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                ))}
              </div>
            )
          ))
        )}
      </div>
    </div>
  );
}

export default ChatHistory; 