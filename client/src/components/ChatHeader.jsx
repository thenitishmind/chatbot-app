import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import styled from 'styled-components';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const HeaderContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: #1976d2;
  color: white;
`;

const StatusContainer = styled(Box)`
  display: flex;
  align-items: center;
`;

const StatusDot = styled(FiberManualRecordIcon)`
  font-size: 12px;
  margin-right: 5px;
  color: ${props => props.isConnected ? '#4caf50' : '#f44336'};
`;

const Title = styled(Typography)`
  font-weight: 500;
  margin-right: 10px;
`;

const ChatHeader = ({ isConnected, onClear }) => {
  return (
    <HeaderContainer>
      <StatusContainer>
        <Title variant="h6">BizLoan Assistant</Title>
        <Tooltip title={isConnected ? 'Connected' : 'Disconnected'}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StatusDot isConnected={isConnected} />
            <Typography variant="caption">
              {isConnected ? 'Online' : 'Offline'}
            </Typography>
          </Box>
        </Tooltip>
      </StatusContainer>
      <Tooltip title="Clear chat">
        <IconButton 
          onClick={onClear}
          sx={{ color: 'white' }}
        >
          <DeleteOutlineIcon />
        </IconButton>
      </Tooltip>
    </HeaderContainer>
  );
};

export default ChatHeader; 