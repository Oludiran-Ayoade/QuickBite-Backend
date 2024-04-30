const mongoose = require('mongoose');

const allowedCategories = ['Burger', 'Shawarma', 'Pizza', 'Chicken Pie', 'Fried Chicken & Chips'];

const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Product name is required'] },
    description: { type: String, required: [true, 'Product description is required'] },
    price: { type: Number, required: [true, 'Product price is required'] },
    category: { type: String, required: [true, 'Product category is required'], enum: allowedCategories },
    stock: { type: Number, default: 0 },
    image: { type: String, required: [true, 'Product description is required'] },
    createdAt: { type: Date, default: Date.now() },
});

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;
