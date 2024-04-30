const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userRouter = require('../routes/userRoute');
const errorHandler = require('./errorHandler');
const ConnectDb = require('../config/dbConfig');
require('dotenv').config()

ConnectDb(); // Connect to MongoDB database

const app = express();

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());
app.use('/auth', userRouter);
app.use(errorHandler);
app.use(morgan('dev'));

module.exports = app;
