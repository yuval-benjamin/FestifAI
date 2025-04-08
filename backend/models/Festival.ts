import mongoose, { Document, Schema } from 'mongoose';

export interface IFestival extends Document {
  name: string;
  country: string;
  dates: string;
  website: string;
}

const FestivalSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  dates: { type: String, required: true },
  website: { type: String, required: true }
});


export const Festival = mongoose.model<IFestival>('Festival', FestivalSchema);
