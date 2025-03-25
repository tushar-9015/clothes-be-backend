import Cart from "../models/Cart.js";
import Product from "../models/Product.js";


export const cartController = {
/**
 * Get all items in the cart.
 */
getCart: async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate({
        path: "items.productId",
        select: "name description price salePrice isOnSale stock images type category",
      });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error("❌ Error fetching cart:", error);
    res.status(500).json({ message: error.message });
  }
},


/**
 * Add or update a cart item.
 */
upsertCartItem: async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    console.log(req.user)
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(400).json({ message: "Product does not exist" });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [{ productId, quantity }] });
    } else {
      const existingItem = cart.items.find(item => item.productId.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;  // 🔹 Increment quantity instead of replacing it
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    // 🔹 Update total price using the method
    await cart.updateTotalPrice();

    res.status(201).json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("❌ Cart Update Error:", error);
    res.status(500).json({ message: error.message });
  }
},

/**
 * Remove an item from the cart.
 */
removeCartItem: async (req, res) => {
  try {
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    await cart.updateTotalPrice();

    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

/**
 * Reset the entire cart.
 */
resetCart: async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
}