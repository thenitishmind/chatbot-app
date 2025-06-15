const Message = require('../models/Message');
const ChatSession = require('../models/ChatSession');
const aiService = require('../services/aiService');

exports.sendMessage = async (req, res) => {
  try {
    const { content, sessionId } = req.body;
    const userId = req.user ? req.user.id : null;

    // Get or create chat session
    let session = await ChatSession.findById(sessionId);
    if (!session) {
      session = await ChatSession.create({
        userId,
        status: 'active'
      });
    }

    // Save user message
    const userMessage = await Message.create({
      sessionId: session.id,
      text: content,
      sender: 'user',
      timestamp: new Date()
    });

    // Get conversation context
    const contextMessages = await Message.find({ sessionId: session.id })
      .sort({ timestamp: -1 })
      .limit(5)
      .lean();

    const context = contextMessages.reverse().map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    // Generate AI response
    const botResponse = await aiService.generateResponse(content, context);

    // Save bot response
    const botMessage = await Message.create({
      sessionId: session.id,
      text: botResponse.text,
      sender: 'bot',
      timestamp: botResponse.timestamp,
      metadata: botResponse.metadata
    });

    // Update session activity
    await ChatSession.findByIdAndUpdate(session.id, {
      lastActivity: new Date()
    });

    res.status(200).json({
      success: true,
      data: {
        userMessage,
        botMessage,
        sessionId: session.id
      }
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({
      success: false,
      error: 'Error processing message'
    });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user ? req.user.id : null;

    const session = await ChatSession.findOne({
      _id: sessionId,
      userId
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Chat session not found'
      });
    }

    const messages = await Message.find({ sessionId })
      .sort({ timestamp: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: {
        messages,
        session
      }
    });
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching chat history'
    });
  }
};

exports.calculateLoan = async (req, res) => {
  try {
    const { amount, term, rate } = req.body;

    if (!amount || !term || !rate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }

    const loanDetails = await aiService.calculateLoanDetails(
      parseFloat(amount),
      parseFloat(term),
      parseFloat(rate)
    );

    if (!loanDetails) {
      return res.status(400).json({
        success: false,
        error: 'Error calculating loan details'
      });
    }

    res.status(200).json({
      success: true,
      data: loanDetails
    });
  } catch (error) {
    console.error('Error in calculateLoan:', error);
    res.status(500).json({
      success: false,
      error: 'Error calculating loan details'
    });
  }
};

exports.endChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user ? req.user.id : null;

    const session = await ChatSession.findOneAndUpdate(
      { _id: sessionId, userId },
      { status: 'ended', lastActivity: new Date() },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Chat session not found'
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error in endChatSession:', error);
    res.status(500).json({
      success: false,
      error: 'Error ending chat session'
    });
  }
}; 