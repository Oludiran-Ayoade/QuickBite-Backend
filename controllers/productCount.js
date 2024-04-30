const productModel = require('../model/productModel');

// Allowed categories
const allowedCategories = ['Burger', 'Shawarma', 'Pizza', 'Chicken Pie', 'Fried Chicken & Chips'];

const productCount = async (req, res) => {
    try {
        const productCounts = await productModel.aggregate([
            { $match: { category: { $in: allowedCategories } } }, // Filter by allowed categories
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        res.json(productCounts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = productCount;
