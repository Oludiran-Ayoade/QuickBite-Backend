const express = require('express');
const mongoose = require('mongoose');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');

require('dotenv').config();

const app = express();

const ConnectDb = () => {
    const URI = process.env.MONGODB_URI;

    if (!URI) {
        console.error('MongoDB URI is not defined');
        return;
    }
    mongoose.connect(process.env.MONGODB_URI) 
      .then(() => {
        console.log('MongoDB connected');
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
      });
};
// app.use(session({
//     secret: process.env.SECRET_KEY, // Use your secret key from .env
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({ 
//       mongoUrl: process.env.MONGODB_URI,
//       ttl: 24 * 60 * 60 // Session expiration time (optional)
//     }),
//     cookie: {
//       maxAge: 24 * 60 * 60 * 1000 // Cookie expiration time (optional)
//     }
//   }));

module.exports = ConnectDb;
