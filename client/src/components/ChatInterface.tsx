import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Box, TextField, IconButton, Paper, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import BotAvatar from './BotAvatar';
import Message from './Message';
import io, { Socket } from 'socket.io-client';

const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: '#0066cc',
  position: 'relative',
  overflow: 'hidden',
}));

const BackgroundPattern = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0.1,
  backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 0)`,
  backgroundSize: '40px 40px',
}));

const ChatWindow = styled(Paper)(({ theme }) => ({
  flex: 1,
  margin: theme.spacing(2),
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 20,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  overflow: 'hidden',
}));

const MessageInput = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(2),
  gap: theme.spacing(1),
  backgroundColor: 'white',
  borderRadius: 30,
  margin: theme.spacing(2),
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 30,
    backgroundColor: 'transparent',
    '& fieldset': {
      border: 'none',
    },
  },
});

interface ChatMessage {
  text: string;
  isBot: boolean;
  timestamp: string;
}

const SOCKET_SERVER_URL = 'http://localhost:5000';

const ChatInterface: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_SERVER_URL);

    // Handle connection events
    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    // Handle incoming bot messages
    socketRef.current.on('bot-response', (response: string) => {
      const botMessage: ChatMessage = {
        text: response,
        isBot: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, botMessage]);
    });

    // Cleanup on unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (message.trim() && socketRef.current) {
      const newMessage: ChatMessage = {
        text: message,
        isBot: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Send message to server
      socketRef.current.emit('user-message', message);
      
      setMessage('');
    }
  };

  return (
    <ChatContainer>
      <BackgroundPattern />
      <ChatWindow elevation={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <BotAvatar />
          <Box sx={{ ml: 2 }}>
            <Typography variant="h5" fontWeight="bold">
              AI Assistant
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isConnected ? 'Online | Ready to help' : 'Offline | Connecting...'}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ flex: 1, overflow: 'auto', px: 2 }}>
          {messages.map((msg, index) => (
            <Message
              key={index}
              text={msg.text}
              isBot={msg.isBot}
              timestamp={msg.timestamp}
            />
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <MessageInput>
          <StyledTextField
            fullWidth
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={!isConnected}
          />
          <IconButton
            onClick={handleSend}
            disabled={!isConnected}
            sx={{
              backgroundColor: isConnected ? '#0066cc' : '#cccccc',
              color: 'white',
              '&:hover': {
                backgroundColor: isConnected ? '#0052a3' : '#cccccc',
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </MessageInput>
      </ChatWindow>
    </ChatContainer>
  );
};

export default ChatInterface; 