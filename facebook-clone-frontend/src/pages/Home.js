import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import AutoLogout from "../utils/AutoLogout";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [editingComment, setEditingComment] = useState(null); // Track the comment being edited
    const [newCommentText, setNewCommentText] = useState(""); // Track the text for comment creation/editing
    const navigate = useNavigate();

    const fetchPosts = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login"); // Redirect to login if not authenticated
        } else {
            try {
                const { data } = await axios.get("/posts", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPosts(data); // Assuming data includes posts along with comments
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        }
    }, [navigate]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // Like Post
    const likePost = async (postId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.post("/likes", { post_id: postId }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchPosts(); // Refresh posts to update likes
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    // Comment on Post
    const commentOnPost = async (postId, comment) => {
        const token = localStorage.getItem("token");
        try {
            await axios.post("/comments", { post_id: postId, title: comment }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchPosts(); // Refresh posts to show new comment
        } catch (error) {
            console.error("Error commenting on post:", error);
        }
    };

    // Edit Comment
    const editComment = async (commentId, newTitle) => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(`/comments/${commentId}`, { title: newTitle }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchPosts(); // Refresh posts to show updated comment
            setEditingComment(null); // Reset editing state
        } catch (error) {
            console.error("Error editing comment:", error);
        }
    };

    // Delete Comment
    const deleteComment = async (commentId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchPosts(); // Refresh posts to remove the deleted comment
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Create New Post
    const createPost = async () => {
        const token = localStorage.getItem("token");
        const postData = { content: text }; // Adjust based on your backend requirements
        try {
            await axios.post("/posts", postData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setText(""); // Reset the input field after submission
            setIsOpen(false); // Close the modal
            fetchPosts(); // Refresh posts after creating a new one
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Welcome to Home</h1>
            <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleLogout}
            >
                Logout
            </button>

            <button
                className="mt-4 mb-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setIsOpen(true)}
            >
                What's on your mind?
            </button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-md w-80">
                        <h2 className="text-xl font-semibold mb-4">Create Post</h2>
                        <textarea
                            className="w-full p-2 border rounded"
                            placeholder="What's on your mind?"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <button
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                            onClick={createPost}
                        >
                            Post
                        </button>
                        <button
                            className="mt-2 px-4 py-2 bg-gray-300 rounded"
                            onClick={() => setIsOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-6">
                {posts.map((post) => (
                    <div key={post._id} className="mb-4 p-4 border rounded shadow">
                        <p className="text-lg">{post.content}</p>
                        <button
                            className="mt-2 px-4 py-1 bg-blue-400 text-white rounded"
                            onClick={() => likePost(post._id)}
                        >
                            Like
                        </button>

                        {/* Display comments below each post */}
                        <div className="mt-4">
                            <h3 className="font-bold">Comments:</h3>
                            {post.comments && post.comments.length > 0 ? (
                                post.comments.map((comment) => (
                                    <div key={comment._id} className="ml-4">
                                        {editingComment === comment._id ? (
                                            <div>
                                                <input
                                                    className="border rounded p-2 w-full"
                                                    value={newCommentText}
                                                    onChange={(e) => setNewCommentText(e.target.value)}
                                                />
                                                <button
                                                    className="mt-2 px-4 py-1 bg-green-500 text-white rounded"
                                                    onClick={() => editComment(comment._id, newCommentText)}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="mt-2 px-4 py-1 bg-gray-500 text-white rounded"
                                                    onClick={() => setEditingComment(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-sm">{comment.title}</p>
                                                <button
                                                    className="mt-2 px-2 py-1 bg-yellow-500 text-white rounded"
                                                    onClick={() => {
                                                        setEditingComment(comment._id);
                                                        setNewCommentText(comment.title);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="mt-2 px-2 py-1 bg-red-500 text-white rounded"
                                                    onClick={() => deleteComment(comment._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="ml-4 text-sm">No comments yet</p>
                            )}
                        </div>

                        {/* Form to add a new comment */}
                        <form
                            className="mt-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const comment = e.target.elements.comment.value;
                                commentOnPost(post._id, comment);
                                e.target.reset();
                            }}
                        >
                            <input
                                name="comment"
                                className="border rounded p-2 w-full"
                                placeholder="Add a comment"
                            />
                            <button
                                type="submit"
                                className="mt-2 ml-2 px-4 py-1 bg-blue-400 text-white rounded"
                            >
                                Comment
                            </button>
                        </form>
                    </div>
                ))}
            </div>

            <AutoLogout />
        </div>
    );
};

export default Home;
