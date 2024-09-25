"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = exports.createPost = void 0;
const Post_1 = __importDefault(require("../models/Post"));
// Create a new post
const createPost = async (req, res) => {
    const { content } = req.body;
    try {
        if (!content)
            return res.status(400).json({ success: false, message: "Content field is missing" });
        const post = new Post_1.default({
            user: req.user._id,
            content,
            comments: [],
            likes: [] // Initialize likes as an empty array if you plan to use it
        });
        await post.save();
        res.status(201).json(post);
    }
    catch (error) {
        res.status(400).json({ message: "Error creating post" });
    }
};
exports.createPost = createPost;
// Fetch all posts along with their comments and the users who commented
const getPosts = async (req, res) => {
    try {
        const posts = await Post_1.default.find()
            .populate("user", "username") // Populate user details for the post
            .populate({
            path: "comments",
            model: "Comment",
            populate: {
                path: "user_id",
                model: "User",
                select: "username" // Populate the user's username in each comment
            }
        })
            .sort({ createdAt: -1 }); // Sort posts by creation date, newest first
        res.status(200).json(posts);
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Error fetching posts" });
    }
};
exports.getPosts = getPosts;
