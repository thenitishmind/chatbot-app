import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import { useLocalStorage } from './useLocalStorage';
import { chatService } from '../services/chatService';

export const useChat = () => {
  const [messages, setMessages] = useLocalStorage('chat-messages', []);
  const [isTyping, setIsTyping] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('bot-message', (message) => {
      setMessages((prevMessages) => [...prevMessages, { ...message, type: 'bot' }]);
      setIsTyping(false);
    });

    socket.on('typing-start', () => setIsTyping(true));
    socket.on('typing-end', () => setIsTyping(false));

    return () => {
      socket.off('bot-message');
      socket.off('typing-start');
      socket.off('typing-end');
    };
  }, [socket, setMessages]);

  const sendMessage = useCallback(async (content) => {
    if (!content.trim()) return;

    const userMessage = {
      content,
      type: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      // Send message to backend
      const response = await chatService.sendMessage(content);
      
      // Emit the message through socket for real-time updates
      if (socket) {
        socket.emit('user-message', userMessage);
      }

      return response;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [socket, setMessages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    if (socket) {
      socket.emit('clear-chat');
    }
  }, [socket, setMessages]);

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat,
  };
}; 