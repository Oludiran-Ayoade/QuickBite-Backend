const productModel = require('../model/productModel');

const deleteProducts = async (req, res) => {
  const productId = req.params.productId;

  try {
    const deletedProduct = await productModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      res.status(404).json({ success: false, message: 'Product not found' });
    } else {
      res.json({ success: true, message: 'Product deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = deleteProducts;
