const express = require('express');
const middleware = require('./middlewares/middleware');


// Initialize dotenv configuration
require('dotenv').config()

// Create an Express app
const app = express();

// Middleware
app.use('/', middleware);

// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
