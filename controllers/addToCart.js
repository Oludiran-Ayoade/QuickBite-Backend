const mongoose = require('mongoose');
const User = require('../model/userModel');
const Product = require('../model/productModel');
const Cart = require('../model/cartModel');

const addToCart = async (req, res) => {
  const { productId, quantity, userId } = req.body;
//   const userId = req.headers['x-user-id'];

  try {
    // Check if userId, productId, or quantity is missing
    if (!userId || !productId || quantity === undefined) {
      return res.status(400).json({ error: 'User ID, Product ID, or Quantity missing in request' });
    }

    // Fetch user
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const product = await Product.findById(productId);

    // Check if product exists
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Fetch or create user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the product is already in the cart
    const existingCartItem = cart.items.find(item => item.product.toString() === productId);
    if (existingCartItem) {
      // If the product is already in cart, update the quantity
      existingCartItem.quantity += quantity;
    } else {
      // If the product is not in cart, add it to the cart
      cart.items.push({ product: new mongoose.Types.ObjectId(productId), quantity });
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = addToCart;
