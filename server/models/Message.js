const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 1000
  },
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    intent: String,
    confidence: Number,
    entities: Object
  }
}, {
  timestamps: true
});

// Add compound index for efficient querying
messageSchema.index({ sessionId: 1, timestamp: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message; 