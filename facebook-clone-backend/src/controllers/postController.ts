import { Request, Response } from "express";
import Post from "../models/Post";
import {upload} from "../middlewares/upload"
import Comment from "../models/Comment"; // Make sure to import the Comment model
import path from 'path';

// Create a new post with optional file upload
export const createPost = [
  async (req: Request, res: Response): Promise<void> => {
    

    try {
      const { content,file } = req.body;
      console.log('abcd');
      
      console.log({content,file,multer:req.file});
      

      // console.clear();
      console.log("req.body",content,file);
      if (!content && !req.file) {
        res.status(400).json({ success: false, message: "Content or file is required" });
        return;
      }

      let filePath = null;
      if (req.file) {
        filePath = `/media/${req.file.filename}`; // Ensure this matches your server's file serving setup
      }

      const post = new Post({
        user: req.user._id,
        content: content,
        file: filePath,
        comments: [],
        likesCount: 0,
      });

      await post.save();
      console.log("Created post:", post); // Add this line
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating the post", error);
      res.status(500).json({ message: "Error creating the post" });
    }
  },
];

// Fetch all posts along with their comments and the users who commented
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate("user", "username") // Populate user details for the post
      .populate({
        path: "comments", // Populate the comments field
        model: "Comment",
        populate: {
          path: "user_id", // Corrected to match your Comment schema's user_id field
          model: "User",
          select: "username" // Populate the user's username in each comment
        }
      })
      .select("content file comments likesCount  createdAt")
      .sort({ createdAt: -1 }); // Sort posts by creation date, newest first

    // console.log("Sending posts:", posts); // Add this line
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Error fetching posts" });
  }
};
