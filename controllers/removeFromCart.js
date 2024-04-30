const Cart = require('../model/cartModel');

const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // Check if userId or productId is missing
    if (!userId || !productId) {
      return res.status(400).json({ error: 'User ID or Product ID missing in request' });
    }

    // Find the cart for the given user
    const cart = await Cart.findOne({ user: userId });

    // If cart not found, return an error
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found for the user' });
    }

    // Remove the product from the cart items array
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = removeFromCart;
