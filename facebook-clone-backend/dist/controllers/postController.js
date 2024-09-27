"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = exports.createPost = void 0;
const Post_1 = __importDefault(require("../models/Post"));
// Create a new post with optional file upload
exports.createPost = [
    async (req, res) => {
        try {
            const { content, file } = req.body;
            console.log('abcd');
            console.log({ content, file, multer: req.file });
            // console.clear();
            console.log("req.body", content, file);
            if (!content && !req.file) {
                res.status(400).json({ success: false, message: "Content or file is required" });
                return;
            }
            let filePath = null;
            if (req.file) {
                filePath = `/media/${req.file.filename}`; // Ensure this matches your server's file serving setup
            }
            const post = new Post_1.default({
                user: req.user._id,
                content: content,
                file: filePath,
                comments: [],
                likesCount: 0,
            });
            await post.save();
            console.log("Created post:", post); // Add this line
            res.status(201).json(post);
        }
        catch (error) {
            console.error("Error creating the post", error);
            res.status(500).json({ message: "Error creating the post" });
        }
    },
];
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
            .select("content file comments likesCount  createdAt")
            .sort({ createdAt: -1 }); // Sort posts by creation date, newest first
        // console.log("Sending posts:", posts); // Add this line
        res.status(200).json(posts);
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Error fetching posts" });
    }
};
exports.getPosts = getPosts;
