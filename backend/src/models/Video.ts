import { Schema, model, Types, Document } from 'mongoose';

export interface IVideo extends Document {
  userId: Types.ObjectId;
  title?: string;
  description?: string;
  videoUrl: string;         // URL vers S3
  thumbnailUrl?: string;    // URL miniature optionnelle
  likes: Types.ObjectId[];  // Utilisateurs ayant liké
  comments: Types.ObjectId[]; // Référence aux commentaires
  createdAt: Date;
  updatedAt: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String },
    description: { type: String },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', default: [] }],
  },
  { timestamps: true }
);

export const Video = model<IVideo>('Video', videoSchema);
