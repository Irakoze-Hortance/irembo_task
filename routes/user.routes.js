const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const verifyToken = require('../middlewares/authorizeToken');

const {upload} = require('../middlewares/upload');


  
router.post('/register', upload.array("profilePhoto"),UserController.createUser);
router.post('/login', UserController.loginUser);
router.post('/reset-password/:token',UserController.resetPassword)
router.post('/initiate-reset',UserController.initiateReset)
router.post('/logout', verifyToken,UserController.logoutUser);
router.post('/upload' ,upload.array("document"),UserController.verifyUser);


module.exports = router;
