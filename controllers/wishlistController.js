import Product from "../models/Product.js";
import Wishlist from "../models/Wishlist.js";


export const wishlistController = {
/**
 * Get all items in the wishlist.
 */
getWishlist: async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id })
      .populate({
        path: "items.productId",
        select: "name description price salePrice isOnSale stock images type category",
      });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json({ wishlist });
  } catch (error) {
    console.error("❌ Error fetching wishlist:", error);
    res.status(500).json({ message: error.message });
  }
},


/**
 * Add or update a wishlist item.
 */
addWishlistItem: async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(400).json({ message: "Product does not exist" });
    }

    let wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      // Create a new wishlist if it doesn't exist
      wishlist = new Wishlist({ userId: req.user._id, items: [{ productId }] });
    } else {
      // Check if the product already exists in the wishlist
      const existingItem = wishlist.items.find(item => item.productId.toString() === productId);
      if (!existingItem) {
        wishlist.items.push({ productId });
      }
    }

    await wishlist.save(); // Save the changes
    res.status(201).json({ message: "Wishlist updated", wishlist });
  } catch (error) {
    console.error("❌ Wishlist Update Error:", error);
    res.status(500).json({ message: error.message });
  }
},

/**
 * Remove an item from the wishlist.
 */
removeWishlistItem: async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);

    res.status(200).json({ message: "Item removed", wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

/**
 * Reset the entire wishlist.
 */
resetWishlist: async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.items = [];

    await wishlist.save();

    res.status(200).json({ message: "Wishlist cleared", wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
}