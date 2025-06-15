import React from 'react';
import { Box } from '@mui/material';
import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
`;

const TypingDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  margin: 0 2px;
  background-color: #90a4ae;
  border-radius: 50%;
  animation: ${bounce} 1.4s infinite ease-in-out;
  animation-delay: ${props => props.delay}s;
`;

const TypingContainer = styled(Box)`
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 5px 10px;
  max-width: 100px;
  background-color: #f5f5f5;
  border-radius: 10px;
`;

const TypingIndicator = () => {
  return (
    <TypingContainer>
      <TypingDot delay={0} />
      <TypingDot delay={0.2} />
      <TypingDot delay={0.4} />
    </TypingContainer>
  );
};

export default TypingIndicator; 