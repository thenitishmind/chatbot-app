import React, { useEffect, useRef } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import styled from 'styled-components';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

const MessageContainer = styled(Box)`
  padding: 10px;
  margin: 5px;
  max-width: 70%;
  border-radius: 10px;
  ${props => props.type === 'user' ? `
    background-color: #e3f2fd;
    margin-left: auto;
    margin-right: 10px;
  ` : `
    background-color: #f5f5f5;
    margin-right: auto;
    margin-left: 10px;
  `}
`;

const MessageWrapper = styled(Box)`
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const StyledAvatar = styled(Avatar)`
  margin: 0 10px;
  background-color: ${props => props.type === 'user' ? '#1976d2' : '#f50057'};
`;

const Message = ({ content, type, timestamp }) => (
  <MessageWrapper>
    {type === 'bot' && <StyledAvatar type={type}><SmartToyIcon /></StyledAvatar>}
    <MessageContainer type={type}>
      <Typography variant="body1">{content}</Typography>
      <Typography variant="caption" color="textSecondary">
        {new Date(timestamp).toLocaleTimeString()}
      </Typography>
    </MessageContainer>
    {type === 'user' && <StyledAvatar type={type}><PersonIcon /></StyledAvatar>}
  </MessageWrapper>
);

const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', padding: '10px' }}>
      {messages.map((message, index) => (
        <Message
          key={index}
          content={message.content}
          type={message.type}
          timestamp={message.timestamp}
        />
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList; 