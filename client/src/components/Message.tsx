import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Paper, Typography } from '@mui/material';

interface MessageProps {
  text: string;
  isBot: boolean;
  timestamp?: string;
}

const MessageContainer = styled(Box)<{ isBot: boolean }>(({ theme, isBot }) => ({
  display: 'flex',
  justifyContent: isBot ? 'flex-start' : 'flex-end',
  marginBottom: theme.spacing(2),
}));

const MessageBubble = styled(Paper)<{ isBot: boolean }>(({ theme, isBot }) => ({
  padding: theme.spacing(1.5, 2),
  maxWidth: '70%',
  borderRadius: 16,
  backgroundColor: isBot ? 'white' : '#0066cc',
  color: isBot ? 'inherit' : 'white',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: 0,
    height: 0,
    border: '8px solid transparent',
    borderTopColor: isBot ? 'white' : '#0066cc',
    borderBottom: 0,
    [isBot ? 'left' : 'right']: 10,
    bottom: -8,
    marginLeft: -8,
  },
}));

const Timestamp = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: 'rgba(0, 0, 0, 0.5)',
  marginTop: theme.spacing(0.5),
}));

const Message: React.FC<MessageProps> = ({ text, isBot, timestamp }) => {
  return (
    <MessageContainer isBot={isBot}>
      <Box sx={{ maxWidth: '70%' }}>
        <MessageBubble isBot={isBot} elevation={1}>
          <Typography variant="body1">{text}</Typography>
        </MessageBubble>
        {timestamp && (
          <Box sx={{ textAlign: isBot ? 'left' : 'right' }}>
            <Timestamp>{timestamp}</Timestamp>
          </Box>
        )}
      </Box>
    </MessageContainer>
  );
};

export default Message; 