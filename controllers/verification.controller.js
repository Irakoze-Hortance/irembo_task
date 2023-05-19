const Verification = require('../models/verification.model');

const uploadDocument = async (req, res) => {
  try {
    const { documentType } = req.body;
    const { filename } = req.files;

    // Assuming you have the logged-in user available in req.user from authentication middleware

    const verification = new Verification({
      documentType,
      document: filename,
      user: req.user._id,
    });

    const savedVerification = await verification.save();

    res.status(200).json({ success: true, data: savedVerification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadDocument,
};
