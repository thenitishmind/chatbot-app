const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'ended'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Add indexes for efficient querying
chatSessionSchema.index({ userId: 1, startedAt: -1 });
chatSessionSchema.index({ status: 1, lastActivity: -1 });

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

module.exports = ChatSession; 