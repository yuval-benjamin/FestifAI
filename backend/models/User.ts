import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  favoriteGenres: string[];
  favoriteArtists: string[];
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  favoriteGenres: { type: [String], default: [] },
  favoriteArtists: [
    {
      name: String,
      image: String
    }
  ],

});

export const User = mongoose.model<IUser>('User', UserSchema);
