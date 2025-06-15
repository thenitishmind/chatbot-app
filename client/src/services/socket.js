import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const emitTypingStart = () => {
  if (socket) {
    socket.emit('typing-start');
  }
};

export const emitTypingEnd = () => {
  if (socket) {
    socket.emit('typing-end');
  }
};

export const uploadFile = async (file) => {
  return new Promise((resolve, reject) => {
    if (!socket) {
      reject(new Error('Socket not connected'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      socket.emit('file-upload', {
        name: file.name,
        type: file.type,
        data: reader.result,
      }, (response) => {
        if (response.success) {
          resolve(response.url);
        } else {
          reject(new Error(response.error));
        }
      });
    };
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsDataURL(file);
  });
}; 