const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authenticateToken = require('../middlewares/authorizeToken');

const {upload} = require('../middlewares/upload');


  
router.post('/register', upload.array("profilePhoto"),UserController.createUser);
// router.get('/dashboard', authenticateToken, (req, res) => {
//     // Render the dashboard template
//     res.render('dashboard');
//   });
router.post('/login', UserController.loginUser);
router.post('/reset-password/:token',UserController.resetPassword)
router.post('/initiate-reset',UserController.initiateReset)
router.post('/logout', authenticateToken,UserController.logoutUser);


module.exports = router;
