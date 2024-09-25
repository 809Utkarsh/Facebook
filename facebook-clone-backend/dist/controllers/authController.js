"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        console.log('Request data:', { username, email, password });
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        console.log('Hashed password:', hashedPassword);
        const user = new User_1.default({ username, email, password: hashedPassword });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || "75y", { expiresIn: "2h" });
        console.log('Generated token:', token);
        res.status(201).json({ token });
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(400).json({ message: "Error creating user" });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login request data:', { email, password });
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || "", { expiresIn: "2h" });
        res.status(200).json({ token });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error logging in:', error.message);
            res.status(500).json({ message: "Error logging in", error: error.message });
        }
        else {
            console.error('Error logging in:', error);
            res.status(500).json({ message: "Error logging in" });
        }
    }
};
exports.login = login;
