import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import TranslateIcon from '@mui/icons-material/Translate';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ChatIcon from '@mui/icons-material/Chat';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import { startListening, stopListening, speakText, stopSpeaking } from '../services/aiService';
import Settings from './Settings';
import ChatHistory from './ChatHistory';
import Navbar from './Navbar';
import { loanMessages } from '../data/loanMessages';
import './ChatBot.css';

const socket = io('http://localhost:5000');

const defaultAvatar = 'https://ui-avatars.com/api/?background=random';

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState(loanMessages);
  const [activeChat, setActiveChat] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    darkMode: false,
    language: 'en-US',
    autoSpeak: false,
    voiceSpeed: 1,
    notifications: false
  });
  const messagesEndRef = useRef(null);

  // Apply dark mode
  useEffect(() => {
    document.body.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light');
  }, [settings.darkMode]);

  // Request notification permission
  useEffect(() => {
    if (settings.notifications && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, [settings.notifications]);

  const showNotification = (message) => {
    if (settings.notifications && Notification.permission === 'granted' && document.hidden) {
      new Notification('New Message', {
        body: message,
        icon: '/path/to/your/icon.png'
      });
    }
  };

  const handleSettingChange = (key, value) => {
    if (key === 'clearHistory') {
      setChatHistory([]);
      setMessages([]);
      setActiveChat(null);
      return;
    }

    setSettings(prev => ({ ...prev, [key]: value }));

    // Handle special cases
    if (key === 'voiceSpeed' && isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    socket.on('bot-response', (response) => {
      const newMessage = { text: response, sender: 'bot', timestamp: new Date() };
      setMessages(prev => [...prev, newMessage]);
      
      if (activeChat) {
        updateChatHistory(activeChat.id, [...messages, newMessage]);
      }

      setIsTyping(false);

      // Auto-speak the response if enabled
      if (settings.autoSpeak) {
        speakText(response);
      }

      if (settings.notifications && document.hidden) {
        showNotification(response);
      }
    });

    socket.on('error', (error) => {
      console.error('Error:', error);
      setIsTyping(false);
    });

    return () => {
      socket.off('bot-response');
      socket.off('error');
      stopListening();
      stopSpeaking();
    };
  }, [settings.autoSpeak, settings.notifications, messages, activeChat, showNotification]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const updateChatHistory = (chatId, updatedMessages) => {
    setChatHistory(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: updatedMessages,
          lastMessage: updatedMessages[updatedMessages.length - 1].text
        };
      }
      return chat;
    }));
  };

  const handleNewChat = () => {
    setActiveChat(null);
    setMessages([]);
    setInputMessage('');
    setIsHistoryOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    const newMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    if (activeChat) {
      // Update existing chat
      const updatedMessages = [...messages, newMessage];
      updateChatHistory(activeChat.id, updatedMessages);
    } else {
      // Create new chat with proper category detection
      const category = detectCategory(inputMessage);
      const newChat = {
        id: Date.now().toString(),
        title: generateChatTitle(inputMessage),
        category,
        messages: [newMessage],
        timestamp: new Date(),
        lastMessage: inputMessage
      };
      setChatHistory(prev => [newChat, ...prev]);
      setActiveChat(newChat);
    }

    setIsTyping(true);
    socket.emit('user-message', inputMessage);
    setInputMessage('');
  };

  const detectCategory = (message) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('property') || lowerMessage.includes('land')) return 'property';
    if (lowerMessage.includes('home') || lowerMessage.includes('house')) return 'home';
    if (lowerMessage.includes('shop') || lowerMessage.includes('store')) return 'shop';
    return 'business';
  };

  const generateChatTitle = (message) => {
    // Generate a meaningful title from the first message
    const words = message.split(' ');
    const title = words.slice(0, 5).join(' ');
    return title.length < message.length ? `${title}...` : title;
  };

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    setMessages(chat.messages);
    setIsHistoryOpen(false);
  };

  const handleDeleteChat = (chatId) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    if (activeChat?.id === chatId) {
      setActiveChat(null);
      setMessages([]);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      startListening(
        (transcript) => {
          setInputMessage(transcript);
        },
        (error) => {
          console.error('Speech recognition error:', error);
          setIsListening(false);
        }
      );
    }
  };

  const handleMessageSpeak = (text) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      speakText(text);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="app-container">
      <Navbar 
        onNewChat={handleNewChat}
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      
      <div className={`main-content ${isHistoryOpen ? 'shifted' : ''}`}>
        <div className="messages-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              {message.text}
              {message.sender === 'bot' && (
                <button
                  className="speak-button"
                  onClick={() => handleMessageSpeak(message.text)}
                >
                  {isSpeaking ? <StopIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
                </button>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="typing-indicator">
              <span>AI is typing</span>
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="message-input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            disabled={isTyping}
          />
          <button
            type="button"
            className="voice-button"
            onClick={handleVoiceInput}
            disabled={isTyping}
          >
            {isListening ? <StopIcon /> : <MicIcon />}
          </button>
          <button
            type="submit"
            className="send-button"
            disabled={!inputMessage.trim() || isTyping}
          >
            <SendIcon />
          </button>
        </form>
      </div>

      {isHistoryOpen && (
        <>
          <div className="history-overlay" onClick={() => setIsHistoryOpen(false)} />
          <ChatHistory
            chats={chatHistory}
            activeChat={activeChat}
            onChatSelect={handleChatSelect}
            onDeleteChat={handleDeleteChat}
            onClose={() => setIsHistoryOpen(false)}
          />
        </>
      )}

      {isSettingsOpen && (
        <Settings
          settings={settings}
          onSettingChange={handleSettingChange}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}

export default ChatBot; 