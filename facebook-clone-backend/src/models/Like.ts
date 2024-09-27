import mongoose, { Schema, Document } from "mongoose";

interface ILike extends Document {
    user_id: mongoose.Schema.Types.ObjectId; // Reference to User
    post_id: mongoose.Schema.Types.ObjectId; // Reference to Post
}

const LikeSchema: Schema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        post_id: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    },
    {
        versionKey: false,
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Adding an index to optimize query performance
LikeSchema.index({ user_id: 1, post_id: 1 }, { unique: true }); // Ensure a user can only like a post once

const Like = mongoose.model<ILike>("Like", LikeSchema);

export default Like;
