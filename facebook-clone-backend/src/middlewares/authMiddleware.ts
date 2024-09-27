import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "";
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace(/bearer\s+/i, "");

    const refreshToken = req.header("Refresh-Token");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError && refreshToken) {
         // check for missing refresh token here
        if (!refreshToken) {
          return res.status(401).json({ message: "Access token expired. Please log in again." });
        }

        try {
          const decoded: any = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
          const user = await User.findById(decoded.id);
        
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
        
          // Generate new tokens
          const newAccessToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
          const newRefreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
        
          // Set new tokens in response headers
          res.setHeader('New-Access-Token', newAccessToken);
          res.setHeader('New-Refresh-Token', newRefreshToken);
        
          // Attach the new access token to the request object (extended interface)
          req.newAccessToken = newAccessToken; // This will now work without errors
        
          req.user = user; // Still attach the user object to req.user for further use
        
          // Proceed to the next middleware or route
          next();
        } catch (refreshError) {
          return res.status(401).json({ message: "Refresh token is invalid or expired. Please log in again." });
        }
        
       } else if (error instanceof jwt.JsonWebTokenError) {
        // Handle invalid token error
        return res.status(401).json({ message: "Invalid token. Please log in again." });
  
      } else if (error instanceof jwt.NotBeforeError) {
        // Handle token not yet valid error
        return res.status(401).json({ message: "Token not yet valid. Please try again later." });
  
      
      } else {
        return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
      }
    }
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  return { accessToken, refreshToken };
};
