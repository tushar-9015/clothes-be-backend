import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, enum: ['men', 'women', 'unisex'] },
    type: { type: String, required: true, enum: ['shoes', 'bags', 't-shirt', 'eyewear', 'shirt', 'jackets'] },
    tag: { type: String, required: true, enum: ['featured', 'trending', 'usual']},
    price: { type: Number, required: true, min: 0 },
    color: { type: String },
    images: { public_id: String, url: String },
    isOnSale: { type: Boolean, default: false },
    salePrice: { type: Number, min: 0 },
    stock: { type: Number, default: 0 }, // Track inventory
  },
  { timestamps: true }
);

export default mongoose.model('Product', ProductSchema);
