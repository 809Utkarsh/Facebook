import mongoose, { Schema, Document } from "mongoose";

interface ILike extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  post_id: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const LikeSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post_id: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Like = mongoose.model<ILike>("Like", LikeSchema);

export default Like;
