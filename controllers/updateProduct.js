const { v2: cloudinaryV2 } = require('cloudinary');
const productModel = require('../model/productModel');

// Configure Cloudinary
cloudinaryV2.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET_KEY 
});

const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, description, price, stock, category, newImage } = req.body;

  try {
    let updatedProduct;
    
    if (newImage) {
      // Upload new image to Cloudinary if provided
      const cloudinaryResponse = await cloudinaryV2.uploader.upload(newImage, { 
        folder: "products",
        quality: 'auto' // Automatically adjust quality based on content
      });

      updatedProduct = await productModel.findByIdAndUpdate(
        productId,
        { name, description, price, stock, category, image: cloudinaryResponse.secure_url },
        { new: true }
      );
    } else {
      updatedProduct = await productModel.findByIdAndUpdate(
        productId,
        { name, description, price, stock, category },
        { new: true }
      );
    }

    if (updatedProduct) {
      res.status(200).send({
        message: "Product updated successfully",
        success: true,
        product: updatedProduct,
      });
    } else {
      res.status(400).send({ message: "Error updating products", success: false });
    }
  } catch (error) {
    res.status(500).send({ message: "Error updating products", error: error.message });
    console.log("server error", error);
  }
};

module.exports = updateProduct;
