const Cart = require('../model/cartModel');

const updateCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    // Check if userId, productId, or quantity is missing
    if (!userId || !productId || quantity === undefined) {
      return res.status(400).json({ error: 'User ID, Product ID, or Quantity missing in request' });
    }

    // Find the cart for the given user
    let cart = await Cart.findOne({ user: userId });

    // If cart not found, create a new one for the user
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Find the product in the cart items array
    const cartItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (cartItemIndex === -1) {
      // If product not found in cart, create a new cart item
      if (quantity > 0) {
        cart.items.push({ product: productId, quantity });
      }
    } else {
      // If product found, update its quantity
      cart.items[cartItemIndex].quantity = quantity;

      // If the new quantity is zero or less, remove the product from the cart
      if (quantity <= 0) {
        cart.items.splice(cartItemIndex, 1);
      }
    }

    await cart.save();

    res.status(200).json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = updateCart;
