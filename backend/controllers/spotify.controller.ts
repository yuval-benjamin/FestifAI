import { Request, Response } from "express";
import { User } from "../models/User";

export const syncSpotifyUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const accessToken = req.query.access_token as string;

    if (!accessToken) {
      res.status(400).json({ error: "Missing access token" });
      return;
    }

    // Fetch Spotify profile
    const profileRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const profileData = await profileRes.json();
    const name = profileData.display_name;
    const email = profileData.email;

    // Fetch top artists
    const topArtistsRes = await fetch("https://api.spotify.com/v1/me/top/artists?limit=10", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const topArtistsData = await topArtistsRes.json();
    const genres = topArtistsData.items
      .flatMap((artist: any) => artist.genres)
      .filter((genre: string, i: number, arr: string[]) => arr.indexOf(genre) === i);

    const artists = topArtistsData.items.map((artist: any) => artist.name);

    // Save or update user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.name = name;
      existingUser.favoriteGenres = genres;
      existingUser.favoriteArtists = artists;
      await existingUser.save();
    } else {
      const newUser = new User({
        name,
        email,
        favoriteGenres: genres,
        favoriteArtists: artists,
      });
      await newUser.save();
    }

   res.json({
      message: "User data synced successfully",
      name,
      email,
    });
  } catch (error) {
    console.error("Error syncing Spotify user:", error);
    res.status(500).json({ error: "Failed to sync user data" });
  }
};

export const getSpotifyUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = req.query.email as string;

    if (!email) {
      res.status(400).json({ error: "Missing email" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching Spotify user:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};