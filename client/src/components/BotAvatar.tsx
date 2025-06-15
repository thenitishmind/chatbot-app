import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const AvatarContainer = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    background: 'linear-gradient(45deg, #0066cc, #00a3ff)',
    borderRadius: '50%',
    opacity: 0.2,
  },
}));

const AvatarInner = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: 'white',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const BotFace = styled(Box)(({ theme }) => ({
  width: '60%',
  height: '60%',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '70%',
    height: '25%',
    backgroundColor: '#0066cc',
    top: '30%',
    left: '15%',
    borderRadius: 4,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '15%',
    height: '15%',
    backgroundColor: '#0066cc',
    borderRadius: '50%',
    top: '20%',
    left: '20%',
    boxShadow: '45px 0 0 #0066cc',
  },
}));

const Headphones = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '120%',
  height: '40%',
  top: '25%',
  left: '-10%',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    width: '30%',
    height: '100%',
    backgroundColor: '#0066cc',
    borderRadius: 8,
  },
  '&::before': {
    left: 0,
  },
  '&::after': {
    right: 0,
  },
  '& span': {
    position: 'absolute',
    top: '-50%',
    left: '10%',
    right: '10%',
    height: '40%',
    backgroundColor: '#0066cc',
    borderRadius: 10,
  },
}));

const BotAvatar: React.FC = () => {
  return (
    <AvatarContainer>
      <AvatarInner>
        <BotFace />
        <Headphones>
          <span />
        </Headphones>
      </AvatarInner>
    </AvatarContainer>
  );
};

export default BotAvatar; 