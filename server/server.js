require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const aiService = require('./services/aiService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Graceful shutdown function
const gracefulShutdown = () => {
  console.log('🔄 Initiating graceful shutdown...');
  server.close(() => {
    console.log('✅ HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// MongoDB Connection with retry logic
const connectMongoDB = async (retries = 5, interval = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB Connected Successfully!');
      io.emit('mongodb-status', { connected: true });
      return;
    } catch (err) {
      console.error(`❌ MongoDB Connection Error (attempt ${i + 1}/${retries}):`, err);
      if (i < retries - 1) {
        console.log(`🔄 Retrying in ${interval/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, interval));
      } else {
        io.emit('mongodb-status', { connected: false, error: err.message });
        throw err;
      }
    }
  }
};

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);
  
  // Send initial connection status
  socket.emit('server-status', { connected: true });
  socket.emit('mongodb-status', { connected: mongoose.connection.readyState === 1 });

  socket.on('user-message', async (message) => {
    try {
      console.log('📝 Received message:', message);
      socket.emit('typing', true);
      
      const response = await aiService.generateResponse(message);
      socket.emit('bot-response', response.message);
    } catch (error) {
      console.error('❌ Error processing message:', error);
      socket.emit('bot-response', 'Sorry, I encountered an error processing your request.');
    } finally {
      socket.emit('typing', false);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Health Check Route
app.get('/health', (req, res) => {
  res.json({
    server: 'running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 5000;

// Start server with port availability check
const startServer = async () => {
  try {
    await connectMongoDB();
    
    server.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.log('🔄 Attempting to find another port...');
        server.listen(0); // Let OS assign a random available port
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });

    server.on('listening', () => {
      const addr = server.address();
      console.log(`✅ Server is listening on port ${addr.port}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 