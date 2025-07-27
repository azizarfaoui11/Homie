// models/Notification.ts
import { Schema, model, Types, Document } from 'mongoose';

export interface INotification extends Document {
  recipient: Types.ObjectId;
  sender: Types.ObjectId;
  type: 'unfollow'|'follow' | 'message' | 'like' | 'comment' |'post' |'partage' ;
  message?: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['unfollow','follow', 'message', 'like', 'comment', 'post','partage'], required: true },
  message: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Notification = model<INotification>('Notification', notificationSchema);
