import { Request, Response } from "express";
import Like from "../models/Like";
import Post from "../models/Post"; // Ensure you import the Post model

// Toggle like or unlike a post
// Toggle like or unlike a post
export const toggleLikePost = async (req: Request, res: Response) => {
  try {
      const { post_id } = req.body; // Ensure post_id is sent in the body
      const user_id = req.user._id;

      // Check if user has already liked the post
      const existingLike = await Like.findOne({ user_id, post_id });
      const post = await Post.findById(post_id);

      if (!post) {
          return res.status(404).json({ message: "Post not found" });
      }

      let updatedLikesCount = post.likesCount; // Initialize updated likes count

      if (existingLike) {
          // If the like exists, unlike the post
          await Like.findOneAndDelete({ user_id, post_id });
          if (updatedLikesCount > 0) {
              updatedLikesCount--; // Decrement likes count
              await Post.findByIdAndUpdate(post_id, { $inc: { likesCount: -1 } });
          }
           console.log(`Post unliked successfully: ${updatedLikesCount} likes remaining`);
          return res.status(200).json({ message: "Post unliked successfully", likesCount: updatedLikesCount });
      } else {
          // If the like does not exist, like the post
          await Like.create({ user_id, post_id });
          updatedLikesCount++; // Increment likes count
          await Post.findByIdAndUpdate(post_id, { $inc: { likesCount: 1 } });
          console.log(`Post liked successfully: ${updatedLikesCount} likes now`);
          return res.status(201).json({ message: "Post liked successfully", likesCount: updatedLikesCount });
      }
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

