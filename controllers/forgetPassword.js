const nodemailer = require('nodemailer');
const userModel = require('../model/userModel');
require('dotenv').config();

// Create a transporter for sending emails using Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Your email service provider
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASS,
  },
});

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email exists in the database
    const user = await userModel.findOne({ email });

    if (!user) {
      res.status(404).json({ success: false, message: 'Email not found' });
      return;
    }

    // Generate a 6-digit OTP using Math.random()
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update the User model or database schema to include an otp field
    await userModel.findOneAndUpdate({ email }, { otp });

    // HTML content for the email with custom styling
    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: "Fredoka", sans-serif;
              margin: 0;
              padding: 0;
            }
            .container {
              border-radius: 10px;
              background-color: #d98e03;
              padding: 10px;
              height: 50px;
              text-align: center;
              color: white;
            }
            p {
              font-size: 15px;
              font-weight: bold;
              font-family: "Fredoka", sans-serif;
              color: #d98e03;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>QuickBite</h2>
            <h3>Password Reset OTP</h3>
          </div>
          <p>Your OTP for password reset is: ${otp}</p>
        </body>
      </html>
    `;

    // Send OTP to the user's email with HTML content
    const mailOptions = {
      from: 'QuickBite <timmyrocks17@gmail.com>',
      to: email,
      subject: 'Password Reset OTP',
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

module.exports = forgetPassword;
