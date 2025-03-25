import Order from "../models/Order.js";
import Product from "../models/Product.js";


export const makeOrder = async (req, res) => {
  try {
    const { items, paymentId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    let totalPrice = 0;
    const orderItems = [];

    // Fetch product details and calculate total price
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.productId}` });
      }

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      totalPrice += product.price * item.quantity;
    }

    // Save the order
    const newOrder = new Order({
      userId: req.user._id,
      items: orderItems,
      totalPrice,
      paymentId,
      status: "pending",
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("❌ Order Creation Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Fetch Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Fetch All Orders Error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "Only pending orders can be canceled" });
    }

    await order.deleteOne();
    res.status(200).json({ message: "Order canceled successfully" });
  } catch (error) {
    console.error("❌ Order Cancellation Error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ message: "Payment ID is required" });
    }

    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "paid") {
      return res.status(400).json({ message: "Order is already paid" });
    }

    order.status = "paid";
    order.paymentId = paymentId;
    await order.save();

    res.status(200).json({ message: "Payment successful, order updated", order });
  } catch (error) {
    console.error("❌ Order Payment Update Error:", error);
    res.status(500).json({ message: error.message });
  }
};
