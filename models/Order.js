import mongoose from "mongoose";

/**
 * OrderItem Schema: Stores product details at the time of purchase.
 * This ensures order history remains unchanged even if product prices change later.
 */
const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Reference to the original product
  name: { type: String, required: true }, // Product name at the time of purchase
  price: { type: Number, required: true }, // Product price at the time of purchase
  quantity: { type: Number, required: true }, // Quantity purchased
});

/**
 * Order Schema: Stores purchase details.
 * Uses the embedded OrderItem schema to maintain a fixed record of purchased items.
 */
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who placed the order
  items: [orderItemSchema], // Embedded OrderItem schema to store item details
  totalPrice: { type: Number, required: true }, // Total amount for the order
  paymentId: { type: String, required: true }, // Payment transaction ID for verification
  status: { 
    type: String, 
    enum: ["pending", "paid"], 
    default: "pending" 
  }, // Order status tracking
  createdAt: { type: Date, default: Date.now }, // Order creation timestamp
});

export default mongoose.model("Order", orderSchema);
