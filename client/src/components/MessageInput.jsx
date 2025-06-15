import React, { useState, useRef } from 'react';
import { Box, TextField, IconButton, Tooltip } from '@mui/material';
import styled from 'styled-components';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ImageIcon from '@mui/icons-material/Image';

const InputContainer = styled(Box)`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
`;

const StyledInput = styled(TextField)`
  flex-grow: 1;
  margin-right: 10px;
  .MuiOutlinedInput-root {
    border-radius: 20px;
    background-color: white;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() || files.length > 0) {
      onSendMessage({ text: message, attachments: files });
      setMessage('');
      setFiles([]);
    }
  };

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFiles = selectedFiles.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isDocument = file.type === 'application/pdf' || 
                        file.type === 'application/msword' ||
                        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return (isImage || isDocument) && isValidSize;
    });

    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputContainer>
        <Tooltip title="Attach file">
          <IconButton 
            onClick={() => fileInputRef.current?.click()}
            color="primary"
          >
            <AttachFileIcon />
          </IconButton>
        </Tooltip>
        <HiddenInput
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileSelect}
        />
        <StyledInput
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={4}
          size="small"
        />
        <IconButton 
          color="primary" 
          onClick={handleSubmit}
          disabled={!message.trim() && files.length === 0}
        >
          <SendIcon />
        </IconButton>
      </InputContainer>
      {files.length > 0 && (
        <Box sx={{ p: 1, bgcolor: '#f5f5f5' }}>
          {files.map((file, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {file.type.startsWith('image/') ? <ImageIcon /> : <AttachFileIcon />}
              <Box sx={{ ml: 1 }}>{file.name}</Box>
            </Box>
          ))}
        </Box>
      )}
    </form>
  );
};

export default MessageInput; 