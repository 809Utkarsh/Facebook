import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
    user: mongoose.Schema.Types.ObjectId;
    content?: string;
    file?: string;
    createdAt: Date;
    likesCount: number; // Keep a count of likes if desired
    comments: mongoose.Schema.Types.ObjectId[]; // Array of comment IDs
}

const PostSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: false },
    file: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    likesCount: { type: Number, default: 0 }, // Optional count field
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // Array of comment IDs
});

const Post = mongoose.model<IPost>("Post", PostSchema);

export default Post;
