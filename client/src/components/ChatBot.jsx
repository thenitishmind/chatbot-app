import React from 'react';
import { Box, Paper } from '@mui/material';
import styled from 'styled-components';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { useChat } from '../hooks/useChat';

const ChatContainer = styled(Paper)`
  width: 400px;
  height: 600px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ChatBot = () => {
  const {
    messages,
    isTyping,
    sendMessage,
    clearChat
  } = useChat();

  const handleSendMessage = (message) => {
    if (message.trim()) {
      sendMessage(message);
    }
  };

  return (
    <ChatContainer elevation={3}>
      <ChatHeader onClear={clearChat} />
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        <MessageList messages={messages} />
        {isTyping && <TypingIndicator />}
      </Box>
      <MessageInput onSendMessage={handleSendMessage} />
    </ChatContainer>
  );
};

export default ChatBot; 