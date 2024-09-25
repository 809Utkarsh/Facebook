import { Request, Response } from "express";
import Like from "../models/Like";

// Like a post
export const likePost = async (req: Request, res: Response) => {
  try {
    const { post_id } = req.body;
    const user_id = req.user._id;

    // Check if user has already liked the post
    const existingLike = await Like.findOne({ user_id, post_id });
    if (existingLike) {
      return res.status(400).json({ message: "You already liked this post." });
    }

    const newLike = await Like.create({ user_id, post_id });
    res.status(201).json(newLike);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
  }
};

// Unlike a post
export const unlikePost = async (req: Request, res: Response) => {
  try {
    const { post_id } = req.params;
    const user_id = req.user._id;

    await Like.findOneAndDelete({ user_id, post_id });
    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
  }
};

// Get likes for a specific post
export const getLikesByPost = async (req: Request, res: Response) => {
  try {
    const { post_id } = req.params;
    const likes = await Like.find({ post_id }).populate("user_id", "username");
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
  }
};
