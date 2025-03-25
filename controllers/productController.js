import Product from "../models/Product.js"

export const productController = {
  // Get all products
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching products', error: err });
    }
  },

  // Get a single product by ID
  getProductById: async (req, res) => {
    try {
      console.log(req.params.id)
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching product', error: err });
    }
  },

  // Create a new product
  createProduct: async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (err) {
      res.status(500).json({ message: 'Error creating product', error: err });
    }
  },

  // Update a product
  updateProduct: async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json({ message: 'Error updating product', error: err });
    }
  },

  // Delete a product
  deleteProduct: async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting product', error: err });
    }
  },

  // products filter
  getFilteredProducts: async (req, res) => {
    try {
    
      const { category, type, tag, minPrice, maxPrice, sort, page = 1, limit = 9 } = req.body;
      // Build filter object
      let filter = {};
      if (category && category.length > 0) filter['category'] = category;
      if (type && type.length > 0) filter['type'] = type;
      if (tag && tag.length > 0) filter['tag'] = tag;
      if (minPrice || maxPrice) filter['price'] = { ...(minPrice && { $gte: minPrice }), ...(maxPrice && { $lte: maxPrice }) };
  
      // Determine sort order
      const sortOption = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};
  
      // Pagination options
      const skip = (page - 1) * limit;
  
      console.log(filter)
      // Fetch products
      const products = await Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit));
  
      // Count total products for pagination metadata
      const total = await Product.countDocuments(filter);
  
      res.status(200).json({
        success: true,
        data: products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        },
      });
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};