const { v2: cloudinaryV2 } = require('cloudinary');
const productModel = require('../model/productModel');

// Configure Cloudinary
cloudinaryV2.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET_KEY 
});

const addProducts = async (req, res) => {
    const { name, description, price, category, stock, image } = req.body;

    try {
        // Upload image to Cloudinary
        const cloudinaryResponse = await cloudinaryV2.uploader.upload(image, { folder: "products", quality: 'auto' });

        // Create a new product instance
        const newProduct = new productModel({
            name,
            description,
            price,
            category,
            stock,
            image: cloudinaryResponse.secure_url,
        });

        // Save the product to the database
        const savedProduct = await newProduct.save();

        res.status(201).json({
            status: true,
            message: "Product added successfully",
            product: savedProduct
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

module.exports = addProducts;
