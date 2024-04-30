const userModel = require('../model/userModel');
const bcrypt = require('bcrypt');

const resetPassword = async (req, res) => {
  const { newPassword, email, otp } = req.body;

  try {
    const user = await userModel.findOne({ email: email, otp: otp });

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
      return;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.findOneAndUpdate({ email: email }, { password: hashedPassword, otp: null });
    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
};

module.exports = resetPassword;
