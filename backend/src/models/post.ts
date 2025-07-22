import { Schema, model, Types, Document } from 'mongoose';

export interface IPost extends Document {
  content: string;
  author: Types.ObjectId;
  image: String;
  likes: Types.ObjectId[];
  sharedFrom: Types.ObjectId | null ;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  sharedFrom: {
  type: Schema.Types.ObjectId,
  ref: 'Post',
  default: null,
},
}, { timestamps: true });


export const Post = model<IPost>('Post', postSchema);
