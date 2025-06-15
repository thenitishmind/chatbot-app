const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const UPLOAD_DIR = path.join(__dirname, '../uploads');

// Ensure uploads directory exists
const initializeUploadDir = async () => {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
};

initializeUploadDir();

const connectedUsers = new Map();

const handleFileUpload = async (fileData) => {
  const { name, type, data } = fileData;
  const fileExtension = path.extname(name);
  const fileName = `${uuidv4()}${fileExtension}`;
  const filePath = path.join(UPLOAD_DIR, fileName);
  
  // Remove the data URL prefix and convert base64 to buffer
  const base64Data = data.replace(/^data:.*?;base64,/, '');
  const fileBuffer = Buffer.from(base64Data, 'base64');
  
  await fs.writeFile(filePath, fileBuffer);
  
  return `/uploads/${fileName}`;
};

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    connectedUsers.set(socket.id, { typing: false });

    // Handle user messages
    socket.on('user-message', async (message) => {
      try {
        // Process attachments if any
        if (message.attachments && message.attachments.length > 0) {
          const uploadedFiles = await Promise.all(
            message.attachments.map(file => handleFileUpload(file))
          );
          message.attachments = uploadedFiles;
        }

        // Broadcast message to all clients except sender
        socket.broadcast.emit('bot-message', {
          ...message,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error processing message:', error);
        socket.emit('error', { message: 'Error processing message' });
      }
    });

    // Handle typing indicators
    socket.on('typing-start', () => {
      const user = connectedUsers.get(socket.id);
      if (user && !user.typing) {
        user.typing = true;
        connectedUsers.set(socket.id, user);
        socket.broadcast.emit('typing-start', { userId: socket.id });
      }
    });

    socket.on('typing-end', () => {
      const user = connectedUsers.get(socket.id);
      if (user && user.typing) {
        user.typing = false;
        connectedUsers.set(socket.id, user);
        socket.broadcast.emit('typing-end', { userId: socket.id });
      }
    });

    // Handle file uploads
    socket.on('file-upload', async (fileData, callback) => {
      try {
        const fileUrl = await handleFileUpload(fileData);
        callback({ success: true, url: fileUrl });
      } catch (error) {
        console.error('File upload error:', error);
        callback({ success: false, error: 'File upload failed' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      connectedUsers.delete(socket.id);
    });
  });
};

module.exports = { setupSocket }; 