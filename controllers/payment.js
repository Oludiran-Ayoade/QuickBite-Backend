const stripe = require('stripe')('sk_test_51P7CXPP9S0EKyjDcmXC2Bhhc8VIpBLl4FcGdB0oWKPAp7T4JDRl2KswzHdYDdvAswK4AUpMey4B0L0JXAN67OIkS00hjmVb5uW');
const nodemailer = require('nodemailer');
const User = require('../model/userModel');

const Payment = async (req, res) => {
  const { userId, amount, paymentMethodId, cart, firstName, email } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'ngn',
      payment_method: paymentMethodId,
      confirm: true,
      return_url: 'http://localhost:5173/',
    });

    if (paymentIntent.status === 'succeeded') {
      // Send email using Nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_PASS
        },
      });

      const htmlContent = `
        <html>
          <head>
            <style>
              /* Styles here */
            </style>
          </head>
          <body>
            <div class="container">
              <h2>QuickBite</h2>
              <h3>Customer's Order</h3>
            </div>
            <h3>Name: Mr ${firstName}</h3>
            <h4>Contact Mail: ${email}</h4>
            <div class="item-container">
              ${cart.map(item => `
                <div class="item">
                  <div class="item-name">${item.name}</div>
                  <div class="item-price">Price: NGN ${item.price.toLocaleString()} | Quantity: ${item.quantity}</div>
                </div>
              `).join('')}
            </div>
            <div class="total-container">
              <p>Total Amount: NGN ${(amount * 0.01).toLocaleString()}</p>
            </div>
          </body>
        </html>
      `;
  
      const mailOptions = {
        from: 'QuickBite <timmyrocks17@gmail.com>',
        to: 'ooludiranayoade@gmail.com',
        subject: 'Payment Successful - Cart Details',
        html: htmlContent,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });

      // Update user's total spent if payment is successful
      user.totalSpent += amount * 0.01;
      await user.save();
  
      res.json({ message: 'Payment processed successfully', paymentIntent });
    } else {
      res.status(400).json({ error: 'Payment failed' });
    }
  } catch (err) {
    console.error('Error processing payment:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = Payment;
