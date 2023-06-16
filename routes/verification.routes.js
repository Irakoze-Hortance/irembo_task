const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authorizeToken');
const {upload} = require('../middlewares/upload');
const verificationController = require('../controllers/verification.controller');





module.exports = router;
