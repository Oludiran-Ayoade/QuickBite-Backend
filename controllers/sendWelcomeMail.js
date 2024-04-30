const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const URI = "mongodb+srv://Oludiran-Ayoade:Circumspect1_@newnode.xwu1abo.mongodb.net/QuickBite?retryWrites=true&w=majority";
const userModel = require('../model/userModel'); 
require('dotenv').config();

const sendWelcomeMail = (recipientEmail) => {
    // Connect to MongoDB to retrieve user data
    mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => userModel.findOne({ email: recipientEmail }))
        .then(user => {
            if (!user) {
                console.error(`User not found for email: ${recipientEmail}`);
                throw new Error(`User not found for email: ${recipientEmail}`);
            }

            // Read HTML, CSS, and image file content from the "views" folder
            // const htmlContent = fs.readFileSync(path.join(__dirname, '..', 'views', 'index.html'), 'utf-8');
            const cssContent = fs.readFileSync(path.join(__dirname, '..', 'views', 'style.css'), 'utf-8');
            const imageData = fs.readFileSync(path.join(__dirname, '..', 'views', 'images', 'image.png'));

            // Convert image data to base64
            const base64Image = imageData.toString('base64');

            // Nodemailer configuration
            // Create a transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.USER_EMAIL,
                    pass: process.env.USER_PASS
                }
            });

            // Email content with the user's first name
            const mailOptions = {
                from: 'QuickBite <timmyrocks17@gmail.com>',
                to: recipientEmail,
                subject: 'Welcome to QuickBite',
                html: `
                    <html>
                    <head>
                      <style>
                        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap');
                        h3 {
                          font-weight: bold;
                          color: color: #d98e03;
                          font-family: 'Fredoka', sans-serif;
                        }
                      </style>
                    </head>
                    <body>
                      <h3>Dear ${user.firstName}, Welcome to QuickBite</h3>
                      <img src="cid:uniqueImageID" alt="Company Background">
                    </body>
                    </html>
                `,
                attachments: [
                    {
                        filename: 'image.jpg',
                        content: base64Image,
                        encoding: 'base64',
                        cid: 'uniqueImageID'
                    }
                ]
            };

            // Send the welcome email
            return transporter.sendMail(mailOptions);
        })
        .then(info => {
            // console.log(`Welcome email sent to ${recipientEmail}: ${info.response}`);
            // // Close the MongoDB connection
            mongoose.connection.close();
        })
        .catch(error => {
            // console.error(`Error sending welcome email to ${recipientEmail}: ${error.message}`);
            // // Close the MongoDB connection in case of an error
            mongoose.connection.close();
            throw error; // Propagate the error for further handling if needed
        });
};

module.exports = sendWelcomeMail;
