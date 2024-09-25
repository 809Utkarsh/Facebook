"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.getCommentsByPost = exports.createComment = void 0;
const Comment_1 = __importDefault(require("../models/Comment")); // Import your comment model
const Post_1 = __importDefault(require("../models/Post")); // Import the Post model to update comments
// Create a new comment
const createComment = async (req, res) => {
    console.log("Received request to create comment:", req.body);
    console.log("Authenticated user:", req.user);
    try {
        const { title, post_id } = req.body;
        // Check if post exists
        const post = await Post_1.default.findById(post_id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        // Create the new comment
        const newComment = await Comment_1.default.create({
            user_id: req.user._id,
            title,
            post_id,
        });
        // Update the post to include the new comment
        post.comments.push(newComment._id); // Type assertion here
        await post.save();
        console.log("Comment created successfully:", newComment);
        res.status(201).json(newComment);
    }
    catch (error) {
        console.log("Error creating comment:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};
exports.createComment = createComment;
// Get all comments for a specific post
const getCommentsByPost = async (req, res) => {
    try {
        const { post_id } = req.params;
        const comments = await Comment_1.default.find({ post_id });
        res.status(200).json(comments);
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};
exports.getCommentsByPost = getCommentsByPost;
// Update a comment
const updateComment = async (req, res) => {
    try {
        const { comment_id } = req.params;
        const { title } = req.body;
        const updatedComment = await Comment_1.default.findByIdAndUpdate(comment_id, { title }, { new: true });
        res.status(200).json(updatedComment);
    }
    catch (error) {
        console.error("Error updating comment:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};
exports.updateComment = updateComment;
// Delete a comment
const deleteComment = async (req, res) => {
    try {
        const { comment_id } = req.params;
        await Comment_1.default.findByIdAndDelete(comment_id);
        res.status(200).json({ message: "Comment deleted" });
    }
    catch (error) {
        console.error("Error deleting comment:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};
exports.deleteComment = deleteComment;
