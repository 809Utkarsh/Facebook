import { Request, Response } from "express";
import Comment from "../models/Comment"; // Import your comment model
import Post from "../models/Post"; // Import the Post model to update comments
import { ObjectId } from "mongoose"; // Import ObjectId for type assertion

// Create a new comment
export const createComment = async (req: Request, res: Response) => {
    console.log("Received request to create comment:", req.body); 
    console.log("Authenticated user:", req.user);
    try {
        const { title, post_id } = req.body;

        // Check if post exists
        const post = await Post.findById(post_id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Create the new comment
        const newComment = await Comment.create({
            user_id: req.user._id, // Use the authenticated user's ID
            title,
            post_id,
        });

        // Update the post to include the new comment
        post.comments.push(newComment._id as ObjectId); // Type assertion here
        await post.save();
        console.log("Comment created successfully:", newComment);
        res.status(201).json(newComment);
    } catch (error) {
        console.log("Error creating comment:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};

// Get all comments for a specific post
export const getCommentsByPost = async (req: Request, res: Response) => {
    try {
        const { post_id } = req.params;
        const comments = await Comment.find({ post_id });
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};

// Update a comment
export const updateComment = async (req: Request, res: Response) => {
    try {
        const { comment_id } = req.params;
        const { title } = req.body;
        const updatedComment = await Comment.findByIdAndUpdate(comment_id, { title }, { new: true });
        res.status(200).json(updatedComment);
    } catch (error) {
        console.error("Error updating comment:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};

// Delete a comment
export const deleteComment = async (req: Request, res: Response) => {
    try {
        const { comment_id } = req.params;
        await Comment.findByIdAndDelete(comment_id);
        res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};
