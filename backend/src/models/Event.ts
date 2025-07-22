import { Schema, model, Types, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  image?: string;
  organizer: Types.ObjectId;
  participants: Types.ObjectId[];
  createdAt: Date;
}

const eventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  image: { type: String },
  organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
}, { timestamps: true });

export const Event = model<IEvent>('Event', eventSchema);
