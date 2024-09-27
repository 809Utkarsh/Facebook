import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    console.log('Request data:', { username, email, password });

    //
    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({message: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", { expiresIn: "2h" });
    console.log('Generated token:', token);
    res.status(201).json({ token });
    
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log('Login request data:', { email, password });

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", { expiresIn: "2h" });
    res.status(200).json({ token });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error logging in:', error.message);
      res.status(500).json({ message: "Error logging in", error: error.message });
    } else {
      console.error('Error logging in:', error);
      res.status(500).json({ message: "Error logging in" });
    }
  }
};
