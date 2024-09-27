"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLikesByPost = exports.toggleLikePost = void 0;
const Like_1 = __importDefault(require("../models/Like"));
const Post_1 = __importDefault(require("../models/Post")); // Ensure you import the Post model
// Toggle like or unlike a post
// Toggle like or unlike a post
const toggleLikePost = async (req, res) => {
    try {
        const { post_id } = req.body; // Ensure post_id is sent in the body
        const user_id = req.user._id;
        // Check if user has already liked the post
        const existingLike = await Like_1.default.findOne({ user_id, post_id });
        const post = await Post_1.default.findById(post_id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        let updatedLikesCount = post.likesCount; // Initialize updated likes count
        if (existingLike) {
            // If the like exists, unlike the post
            await Like_1.default.findOneAndDelete({ user_id, post_id });
            if (updatedLikesCount > 0) {
                updatedLikesCount--; // Decrement likes count
                await Post_1.default.findByIdAndUpdate(post_id, { $inc: { likesCount: -1 } });
            }
            console.log(`Post unliked successfully: ${updatedLikesCount} likes remaining`);
            return res.status(200).json({ message: "Post unliked successfully", likesCount: updatedLikesCount });
        }
        else {
            // If the like does not exist, like the post
            await Like_1.default.create({ user_id, post_id });
            updatedLikesCount++; // Increment likes count
            await Post_1.default.findByIdAndUpdate(post_id, { $inc: { likesCount: 1 } });
            console.log(`Post liked successfully: ${updatedLikesCount} likes now`);
            return res.status(201).json({ message: "Post liked successfully", likesCount: updatedLikesCount });
        }
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
    }
};
exports.toggleLikePost = toggleLikePost;
// Get likes for a specific post
const getLikesByPost = async (req, res) => {
    try {
        const { post_id } = req.params;
        const likes = await Like_1.default.find({ post_id }).populate("user_id", "username");
        res.status(200).json(likes);
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
    }
};
exports.getLikesByPost = getLikesByPost;
