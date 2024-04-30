const userModel = require('../model/userModel');
const sendWelcomeEmail = require('../controllers/sendWelcomeMail');
const mongoose = require('mongoose'); // Import mongoose

const registerUser = (req, res) => {
    // Ensure MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
        // Connection is not established
        return res.status(500).send({ status: false, message: "Internal Server Error: MongoDB not connected" });
    }

    // Extract user data from the request body
    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: 0 // Default role
    };

    // Check for missing fields
    if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
        return res.status(400).send({ status: false, message: "All fields are mandatory" });
    }

    // Check if the first name or email contains 'admin'
    if (userData.firstName.toLowerCase().includes('admin') || userData.email.toLowerCase().includes('admin')) {
        userData.role = 1; // Set role to 1 for admin
    }

    // Check if the email is already in use
    userModel.findOne({ email: userData.email })
        .then(existingUser => {
            if (existingUser) {
                // User with the same email already exists
                res.status(409).send({ status: false, message: "User already exists with this email" });
            } else {
                // Save the new user if validation passes
                const newUser = new userModel(userData);
                newUser.save()
                    .then(() => {
                        // Send welcome email
                        sendWelcomeEmail(userData.email);
                        res.status(201).send({ status: true, message: "Sign Up was successful" });
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).send({ status: false, message: "Internal Server Error" });
                    });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ status: false, message: "Internal Server Error" });
        });
};

module.exports = registerUser;
