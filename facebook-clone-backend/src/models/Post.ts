import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  user: mongoose.Schema.Types.ObjectId;
  content?: string;
  file?:string;
  createdAt: Date;
  likes: mongoose.Schema.Types.ObjectId[]; // Array of user IDs who liked the post
  comments: mongoose.Schema.Types.ObjectId[]; // Array of comment IDs
}

const PostSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: false },
  file: {type:String,required:false},
   createdAt: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }], // Added likes field
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // Added comments field
});

const Post = mongoose.model<IPost>("Post", PostSchema);

export default Post;
