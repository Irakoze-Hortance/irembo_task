const User = require('../models/user.model');
var jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs');
const config = require('../config/auth.config')
const crypto = require("crypto");
const nodemailer= require("nodemailer")
require("dotenv").config();


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

    const token = jwt.sign(
      { user_id: user._id },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;
    const userData = await user.save();

    const message={
      from:"uwimanamarie00@gmail.com",
      to:user.email,
      subject:'Welcome to Account Verification!',
      text:`You are receiving this email because you 
      (or someone else) have created an account. 
      Please click the following link to log into your portal:
      http://localhost:8000/`
  }

  transporter.sendMail(message,(error,info)=>{
    if(error){
        console.error("error sending login email",error);
        return res.status(500).json({
            error:"Error sending email"
        })
    }

    console.log('Login email sent:', info.response)
    res.json({message:"Check your email"})
 })


  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    const user = await User.findOne({ email });

    if (user && (await bcryptjs.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
        
      );
      user.token = token;

    res.render('dashboard',{user:user,token})
 
}
} catch (error) {
  res.status(500).json({ error: error.message });
}
}

const logoutUser = async (req, res) => {
      try {
        const userId = req.params.id;
        const user = await User.findOne({ where: { id: userId } });
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        const userJson = user.get({ plain: true });
        const {
          password, ...userProfile
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
        res.send("Password reset initated. Check your email")
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
  
      const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
  
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }
  
      user.password = password;
  
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
        await user.save();
  
      res.json({ message: 'Reset password successful' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  async function verifyUser(req, res) {
    try {
      const { email, document,documentType } = req.body;

      if (!req.body) {
        res.status(400).send("All input is required");
      }
      const user = await User.findOne({ email });

      user.verificationStatus = "PENDING VERIFICATION";
      await user.save();
  
      const transporter = nodemailer.createTransport({
  
        service: 'Gmail',
        auth: {
        user: 'uwimanamarie00@gmail.com', 
        pass: 'pmdkxuimcxjtopqi', 
      },
      });
  
      const mailOptions = {
        from: 'uwimanamarie00@gmail.com',
        to: user.email,
        subject: 'Verification Request',
        text: 'Your verification request has been received. We will process it shortly.'
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Failed to send verification email:', error);
          throw error;
        }
        console.log('Verification email sent:', info.response);
      });
  
      res.send("Check your email")
      return user;
    } catch (error) {
      console.error('Failed to verify user:', error);
      throw error;
    }
  }
  
module.exports = {
  createUser,
  loginUser,
  logoutUser,
  resetPassword,
  initiateReset,
  verifyUser
};


{}