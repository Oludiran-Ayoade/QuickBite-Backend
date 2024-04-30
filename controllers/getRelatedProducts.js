const Product = require('../model/productModel');

const getRelatedProducts = async (req, res) => {
    const { category } = req.query;
  
    try {
      const products = await Product.find({ category });
      if (!products) {
        return res.status(404).json({ success: false, message: 'No related products found' });
      }
  
      res.status(200).json({ success: true, products });
    } catch (error) {
      console.error('Error fetching related products:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };

module.exports = getRelatedProducts;