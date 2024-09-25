"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authMiddleware = async (req, res, next) => {
    try {
        // Extract token from the Authorization header
        const token = req.header("Authorization")?.replace("Bearer ", "");
        // Check if token exists
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        // Verify and decode the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        console.log("Decoded token:", decoded);
        // Ensure decoded token contains the user ID
        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Invalid token payload" });
        }
        // Fetch the user from the database
        const user = await User_1.default.findById(decoded.id);
        // Handle case where user is not found
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Attach the user to the request object
        req.user = user;
        next();
    }
    catch (error) {
        // Log any error that occurs for debugging purposes
        console.error("Error in authMiddleware:", error);
        // Return an error response for invalid token
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.authMiddleware = authMiddleware;
