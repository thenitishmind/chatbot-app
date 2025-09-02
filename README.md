# Chatbot.

A sophisticated AI-powered chatbot designed to assist users with business loan inquiries. Built with React, Node.js, OpenAI GPT-3.5, and supports both MongoDB and PostgreSQL.

## 🌟 Features

### AI Capabilities
- 🤖 OpenAI GPT-3.5 powered responses
- 🎯 Intent detection for targeted assistance
- 📊 Sentiment analysis for user feedback
- 💡 Context-aware conversations
- 🔄 Automatic fallback responses

### Chat Features
- 💬 Real-time messaging with Socket.IO
- 📝 Message history and persistence
- ⌨️ Live typing indicators
- 📎 File upload support (images & documents)
- 📱 Responsive design

### Business Loan Features
- 💰 Loan calculation utilities
- 📋 Application process guidance
- 📑 Document requirement information
- 💳 Interest rate information
- 📊 Payment schedule generation

### Technical Features
- 🔐 JWT authentication
- 🗄️ Dual database support (MongoDB/PostgreSQL)
- 📡 Real-time WebSocket communication
- 🔄 Session management
- 🛡️ Rate limiting protection

## 🛠️ Tech Stack

### Frontend
- React 18
- Material-UI
- Socket.IO Client
- Styled Components
- Axios

### Backend
- Node.js
- Express
- MongoDB/PostgreSQL
- Socket.IO
- OpenAI API

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB or PostgreSQL
- OpenAI API key
- NPM or Yarn

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)
```bash
# Server Configuration
PORT=5000
NODE_ENV=development




#### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chatbot.git
cd chatbot
```

2. Install dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up the database:
```bash
# For MongoDB
# Make sure MongoDB is running

# For PostgreSQL
# Create database
createdb chatbot
```

4. Start the application:
```bash
# Start backend server
cd server
npm run dev

# Start frontend development server
cd ../client
npm start
```

## 🔌 API Endpoints

### Chat Endpoints
```
POST /api/chat/message - Send a message
GET /api/chat/history/:sessionId - Get chat history
POST /api/chat/calculate-loan - Calculate loan details
POST /api/chat/session/end/:sessionId - End chat session
```

### Authentication Endpoints
```
POST /api/auth/register - Register new user
POST /api/auth/login - Login user
POST /api/auth/refresh - Refresh access token
```

## 💬 Socket Events

### Client Events
```javascript
socket.emit('user-message', message);
socket.emit('typing-start');
socket.emit('typing-end');
socket.emit('file-upload', file);
```

### Server Events
```javascript
socket.on('bot-message', message);
socket.on('typing-start', user);
socket.on('typing-end', user);
socket.on('file-upload-success', url);
```

## 🗄️ Database Schema

### MongoDB Schema
```javascript
// Message Schema
{
  sessionId: String,
  text: String,
  sender: Enum['user', 'bot'],
  timestamp: Date,
  metadata: {
    intent: String,
    confidence: Number,
    entities: Object
  }
}

// ChatSession Schema
{
  id: String,
  userId: String,
  startedAt: Date,
  lastActivity: Date,
  status: Enum['active', 'ended']
}
```

### PostgreSQL Schema
```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  sender VARCHAR(10) CHECK (sender IN ('user', 'bot')),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB
);

CREATE TABLE chat_sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active'
);
```

## 🔒 Security Features

- JWT authentication
- Rate limiting
- Input validation
- SQL injection protection
- XSS prevention
- File upload validation
- Secure password hashing

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 📦 Deployment

The application can be deployed to various platforms:

### Backend
- Heroku
- AWS EC2
- Google Cloud Platform
- Digital Ocean

### Frontend
- Vercel
- Netlify
- AWS S3
- GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-3.5
- Socket.IO team
- MongoDB team
- PostgreSQL team
- React team 
