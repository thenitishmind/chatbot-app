const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // For now, we'll skip authentication for the chatbot
    // This is a simplified version for development
    next();
    
    /* Uncomment this section when you want to implement full authentication
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
    */
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = auth; 