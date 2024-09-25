import { Request, Response } from "express";
import Post from "../models/Post";
import {upload} from "../middlewares/upload"
import Comment from "../models/Comment"; // Make sure to import the Comment model

// Create a new post with optional file upload
export const createPost  = [

  upload.single('file'),
  async (req:Request, res:Response):Promise<void>=>{
    const {content} = req.body;

    try{
      if(!content && !req.file){
        res.status(400).json({success:false,message:"content or file is required"});
        return;
      }
      const post  = new Post({
        user:req.user._id,
        file:req.file ? req.file.path:null,
        comments:[],
        likes: [],

      });
      await post.save();
      res.status(201).json(post);
    }catch(error){
      console.log("Error creating the post", error);
      res.status(500).json({message:"Error creating the post"});
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
      .select("content file comments likes createdAt")
      .sort({ createdAt: -1 }); // Sort posts by creation date, newest first

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Error fetching posts" });
  }
};
