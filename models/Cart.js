import mongoose from "mongoose";

/**
 * Cart schema to store items added by a user before checkout.
 * Each item stores the price at the time of addition to calculate total cost accurately.
 */
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who owns the cart
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Reference to product
      quantity: { type: Number, default: 1 }, // Number of units added to the cart
    },
  ],
  totalPrice: { type: Number, default: 0 }, // Stores total cart value
});

/**
 * Middleware to calculate total price before saving the cart.
 * Ensures that totalPrice updates when items are added or removed.
 */
cartSchema.methods.updateTotalPrice = async function () {
  const cart = this;
  let total = 0;

  for (const item of cart.items) {
    const product = await mongoose.model("Product").findById(item.productId);
    if (product) {
      total += (product.isOnSale ? product.salePrice : product.price) * item.quantity;
    }
  }

  cart.totalPrice = total;
  await cart.save();
};

export default mongoose.model("Cart", cartSchema);
