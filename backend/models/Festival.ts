import mongoose, { Document, Schema } from 'mongoose';

export interface IFestival extends Document {
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  locationCode: string;
  genre: string;
  website: string;
}

const FestivalSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  locationCode: { type: String, required: true },
  genre: { type: String, required: true },
  website: { type: String, required: true }
});


export const Festival = mongoose.model<IFestival>('Festival', FestivalSchema);
