const User = require('../models/user.model');
var jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs');
const config = require('../config/auth.config')
const RevokedToken = require("../models/revokedToken.model");
const { response } = require('express');
const crypto = require("crypto");
const nodemailer= require("nodemailer")

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
      user: 'uwimanamarie00@gmail.com', 
      pass: 'pmdkxuimcxjtopqi', 
    },
    tls: {
      rejectUnauthorized: false, 
    },
})


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

    // res.status(200).json({ success: true, data: userData});
    res.redirect('/')

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcryptjs.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({userId:user._id},config.secret,{
        expiresIn:'8h'
    })
    await user.save();
    // res.send({user:user})

    // res.redirect('/dashboard',{user:user});
    // res.json({user:user}).redirect('/dashboard');
    res.render('dashboard',{user:user})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logoutUser = async (req, res) => {
      try {
        const userId = req.params.id;
        const user = await User.findOne({ where: { id: userId } });
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        const userJson = user.get({ plain: true });
        const {
          password, created_at, updated_at, ...userProfile
        } = userJson;
    
        return res.json(userProfile);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
      }
  };

  const initiateReset= async(req,res)=>{
    try{
        const {email}= req.body;
        const user = await User.findOne({email});

    if(!user){
        return res.status(404).json({error:"User not found"});
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken= token;
    user.resetPasswordExpires=Date.now() +3600000;
    await user.save();

    const message={
        from:"uwimanamarie00@gmail.com",
        to:email,
        subject:'Password reset',
        text:`You are receiving this email because you 
        (or someone else) have requested to reset your password. 
        Please click the following link to reset your password:
        http://localhost:8000/api/v1/users/reset-password/${token}`
    }


     transporter.sendMail(message,(error,info)=>{
        if(error){
            console.error("error sending password reset email",error);
            return res.status(500).json({
                error:"Error sending email"
            })
        }

        console.log('password reset email sent:', info.response)
        res.json({message:"Password reset initated. Check your email"})
     })
}catch(error){
    res.status(500).json({
        error:error.message
    })
}
  }

  const resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
  
      // Find the user with the corresponding reset token
      const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
  
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }
  
      // Set the new password
      user.password = password;
  
      // Clear the reset token and expiration
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
  
      // Save the updated user
      await user.save();
  
      res.json({ message: 'Reset password successful' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
module.exports = {
  createUser,
  loginUser,
  logoutUser,
  resetPassword,
  initiateReset
};


{}