import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  favoriteGenres: string[];
  favoriteSongs: string[];
  spotifyAccessToken?: string;
  spotifyRefreshToken?: string;
  spotifyTokenExpiresAt?: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  favoriteGenres: { type: [String], default: [] },
  favoriteSongs: { type: [String], default: [] },
  spotifyAccessToken: { type: String },
  spotifyRefreshToken: { type: String },
  spotifyTokenExpiresAt: { type: Date },
});


export const User = mongoose.model<IUser>('User', UserSchema);
