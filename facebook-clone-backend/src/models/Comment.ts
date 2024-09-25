import mongoose, { Schema, Document } from "mongoose";

interface IComment extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  post_id: mongoose.Schema.Types.ObjectId;
  title: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post_id: { type: Schema.Types.ObjectId, ref: "Post", required: true }, // Linking to the Post
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
