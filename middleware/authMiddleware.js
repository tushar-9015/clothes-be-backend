// import jwt from 'jsonwebtoken';

// export const protect = (req, res, next) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: 'Not authorized, no token' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is defined
//     req.user = decoded.id;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Not authorized, token failed' });
//   }
// };


import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    console.log("🔍 Token received:", token); // Debugging log

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded); // Check if user ID exists in token

    req.user = await User.findById(decoded.id).select("-password");
    
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    console.log("✅ User authenticated:", req.user._id);
    next();
  } catch (error) {
    console.error("❌ Authentication error:", error.message);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
