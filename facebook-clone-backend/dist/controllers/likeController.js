"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLikesByPost = exports.unlikePost = exports.likePost = void 0;
const Like_1 = __importDefault(require("../models/Like"));
// Like a post
const likePost = async (req, res) => {
    try {
        const { post_id } = req.body;
        const user_id = req.user._id;
        // Check if user has already liked the post
        const existingLike = await Like_1.default.findOne({ user_id, post_id });
        if (existingLike) {
            return res.status(400).json({ message: "You already liked this post." });
        }
        const newLike = await Like_1.default.create({ user_id, post_id });
        res.status(201).json(newLike);
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
    }
};
exports.likePost = likePost;
// Unlike a post
const unlikePost = async (req, res) => {
    try {
        const { post_id } = req.params;
        const user_id = req.user._id;
        await Like_1.default.findOneAndDelete({ user_id, post_id });
        res.status(200).json({ message: "Post unliked successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
    }
};
exports.unlikePost = unlikePost;
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
