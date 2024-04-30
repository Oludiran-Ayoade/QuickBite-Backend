const User = require('../model/userModel');
const Cart = require('../model/cartModel');
const Product = require('../model/productModel');

const getCart = async (req, res) => {
  const userId = req.params.userId;
  
  try {
    // Check if userId is missing
    if (!userId) {
      return res.status(400).json({ error: 'User ID missing in request' });
    }

    // Find the user's cart and populate the cart items with product details
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    
    // Check if cart exists for the user
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found for this user' });
    }

    // Extract the cart items with product details
    const cartItems = cart.items.map(item => ({
      _id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image
    }));

    res.status(200).json({ cart: cartItems });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = getCart;
