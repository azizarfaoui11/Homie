import { Schema, model, Types, Document } from 'mongoose';

export interface IComment extends Document {
  post?: Types.ObjectId;
  video?: Types.ObjectId;          // facultatif

  author: Types.ObjectId;
  content: string;
  createdAt: Date;
  likes: Types.ObjectId[];
  replies: Types.ObjectId[];
  parentCommentId: Types.ObjectId;
  
}

const commentSchema = new Schema<IComment>({
  post: { type: Schema.Types.ObjectId, ref: 'Post', default: null },
  video: { type: Schema.Types.ObjectId, ref: 'Video', default: null },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  replies: [{ type: Schema.Types.ObjectId, ref: 'Comment', default: [] }],
  parentCommentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null }, // ✅ AJOUT ICI

}, { timestamps: true });

export const Comment = model<IComment>('Comment', commentSchema);
