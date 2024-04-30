const userModel = require('../model/userModel');

// Route to verify OTP entered by the user
const verifyOtp = async (req, res) => {
  const { email, userOTP } = req.body;
  console.log(req.body);

  try {
    // Fetch the user from the database
    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    console.log(user.otp);
    // Check if the user's OTP matches the provided OTP
    if (user.otp !== userOTP) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
     
    }
    // Check if the OTP has expired (60 seconds)
    const currentTime = new Date();
    const otpSentTime = user.otpSentAt; // Assuming you have a field 'otpSentAt' in your user schema
    const timeDifference = currentTime - otpSentTime;
    const otpExpirationTime = 60000; // 60 seconds in milliseconds

    if (timeDifference > otpExpirationTime) {
      return res.status(400).json({ success: false, message: 'OTP has expired, Generate another OTP' });
    }

    // If everything is valid, proceed with resetting the password
    // You can redirect or send a success message, or handle the logic as per your requirement

    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
};

module.exports = verifyOtp;
