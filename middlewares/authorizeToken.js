const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');
const User = require('../models/user.model');

const authenticateToken = async (req, res, next) => {
  try {
    // Assuming the token is passed in the request headers as "Authorization: Bearer token"
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded= jwt.verify(token,authConfig.secret)
    const user = await User.findById(decoded.userID)

    if(!user){
        return res.status(401).json({ error: 'Invalid token. User not found'})
    }

      req.user = user;

      next();
   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = authenticateToken;
