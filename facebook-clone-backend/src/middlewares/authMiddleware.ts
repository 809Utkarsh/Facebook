import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract token from the Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify and decode the token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "");
    
    console.log("Decoded token:", decoded);
    // Ensure decoded token contains the user ID
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Fetch the user from the database
    const user = await User.findById(decoded.id);
    
    // Handle case where user is not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the user to the request object
    req.user = user; 
    next();
  } catch (error) {
    // Log any error that occurs for debugging purposes
    console.error("Error in authMiddleware:", error);

    // Return an error response for invalid token
    return res.status(401).json({ message: "Invalid token" });
  }
};
