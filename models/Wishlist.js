import mongoose from "mongoose";

/**
 * Wishlist schema to store products a user wants to save for later.
 */
const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who owns the wishlist
  items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Reference to product
      }
    ],
});

export default mongoose.model("Wishlist", wishlistSchema);


