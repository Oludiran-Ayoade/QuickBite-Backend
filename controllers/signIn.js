const userModel = require('../model/userModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const signin = async (req, res) => {
  try {
    // Ensure MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).send({ status: false, message: "Internal Server Error: MongoDB not connected" });
    }

    // Extract email and password from the request body
    const { email, password } = req.body;

    // Check if any of the required fields is missing
    if (!email || !password) {
      return res.status(400).send({ status: false, message: "All fields are mandatory" });
    }

    // Check if the user exists in the database
    const user = await userModel.findOne({ email });

    if (!user) {
      // User not found
      return res.status(404).send({ status: false, message: 'Account does not exist. Try creating one.' });
    }

    // Validate the user's password
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      // Wrong credentials
      return res.status(401).send({ status: false, message: 'Wrong Credentials' });
    }

    // Generate token with email and role (assuming role is a field in userModel)
    const secret = process.env.SECRET_KEY;
    const tokenPayload = { email, role: user.role }; // Include role in token payload
    const token = jwt.sign(tokenPayload, secret, { expiresIn: '2d' });

    // Check the user's role and set the appropriate response message
    if (user.role === 1) {
      res.send({ status: true, message: 'Admin Sign-in Successful', token, user });
    } else {
      res.send({ status: true, message: 'User Sign-in Successful', token, user });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: 'Internal Server Error' });
  }
};

module.exports = signin;
