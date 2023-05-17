const User = require('../models/user.model');
var jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs');
const config = require('../config/auth.config')
const RevokedToken = require("../models/revokedToken.model")

const createUser = async (req, res) => {
  const { names, password, confirmPassword, ...userData } = req.body;

    if (!req.body) {
    return res.status(400).json({ success: false, message: 'Bad Request' });
    }
    console.log(req.body)

    if(password !== confirmPassword) {
        console.log("Passwords do not match")
    }

  try {
    const user = new User(req.body);
    const salt = await bcryptjs.genSalt(8)
    user.password = await bcryptjs.hash(password,salt);
    user.profilePhoto= req.files;
    const userData = await user.save();

    res.status(200).json({ success: true, data: userData});

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { names, password } = req.body;

    const user = await User.findOne({ names });

    if (!user || !(await bcryptjs.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid names or password' });
    }

    const token = jwt.sign({userId:user._id},config.secret,{
        expiresIn:'8h'
    })
    res.json({token,user});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logoutUser = async (req, res) => {
    try {
      // Assuming you have a middleware that verifies and decodes the token from the request headers
      const token = req.headers.authorization.split(' ')[1];

      const revokedToken = new RevokedToken({ token });
      await revokedToken.save();
  
      res.json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
module.exports = {
  createUser,
  loginUser,
  logoutUser,
};


