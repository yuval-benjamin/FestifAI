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

    res.json({ message: "User data synced successfully" });
  } catch (error) {
    console.error("Error syncing Spotify user:", error);
    res.status(500).json({ error: "Failed to sync user data" });
  }
};
































// import { Request, Response } from "express";
// import { User } from '../models/User';
// import querystring from "querystring";
// import https from "https";
// import dotenv from "dotenv";

// dotenv.config();
// const userTokens: Record<string, string> = {};

// const client_id = process.env.SPOTIFY_CLIENT_ID as string;
// const client_secret = process.env.SPOTIFY_CLIENT_SECRET as string;
// const redirect_uri = 'http://localhost:3000/spotify/callback';

// const generateRandomString = (length: number) => {
//     const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     return Array.from({ length }, () => possible.charAt(Math.floor(Math.random() * possible.length))).join('');
// };

// export const loginSpotify = (req: Request, res: Response) => {
//     const state = generateRandomString(16);
//     const scope = 'user-read-private user-read-email user-top-read';

//     res.redirect('https://accounts.spotify.com/authorize?' +
//         querystring.stringify({
//             response_type: 'code',
//             client_id: client_id,
//             scope: scope,
//             redirect_uri: redirect_uri,
//             state: state,
//         })
//     );
// };

// export const spotifyCallback = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const code = req.query.code as string;
//         if (!code) {
//             res.status(400).json({ error: "No authorization code provided" });
//             return;
//         }

//         const postData = querystring.stringify({
//             grant_type: "authorization_code",
//             code: code,
//             redirect_uri: redirect_uri,
//         });

//         const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/x-www-form-urlencoded",
//                 Authorization: "Basic " + Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
//             },
//             body: postData,
//         });

//         const tokenData = await tokenResponse.json();
//         const accessToken = tokenData.access_token;

//         if (!accessToken) {
//             res.status(400).json({ error: "Failed to retrieve access token" });
//             return;
//         }

//         // Save access token
//         userTokens["default_user"] = accessToken;

//         // Fetch user profile
//         const profileRes = await fetch("https://api.spotify.com/v1/me", {
//             headers: { Authorization: `Bearer ${accessToken}` },
//         });
//         const profileData = await profileRes.json();

//         const name = profileData.display_name;
//         const email = profileData.email;

//         // Fetch top artists
//         const topArtistsRes = await fetch("https://api.spotify.com/v1/me/top/artists?limit=10", {
//             headers: { Authorization: `Bearer ${accessToken}` },
//         });
//         const topArtistsData = await topArtistsRes.json();

//         const genres = topArtistsData.items
//             .flatMap((artist: any) => artist.genres)
//             .filter((genre: string, i: number, arr: string[]) => arr.indexOf(genre) === i);

//         const songs = topArtistsData.items
//             .map((artist: any) => artist.name); // Just using artist names as a proxy for "favorite songs" for now

//         // Save user to DB
//         const existingUser = await User.findOne({ email });

//         if (existingUser) {
//             existingUser.favoriteGenres = genres;
//             existingUser.favoriteSongs = songs;
//             await existingUser.save();
//         } else {
//             const newUser = new User({
//                 name,
//                 email,
//                 favoriteGenres: genres,
//                 favoriteSongs: songs,
//             });
//             await newUser.save();
//         }

//         res.json({
//             access_token: tokenData.access_token,
//             refresh_token: tokenData.refresh_token,
//             expires_in: tokenData.expires_in,
//         });
//     } catch (error) {
//         console.error("Error in spotifyCallback:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };
// // export const spotifyCallback = async (req: Request, res: Response): Promise<void> => {
// //     try {
// //         const code = req.query.code as string;
// //         if (!code) {
// //             res.status(400).json({ error: "No authorization code provided" });
// //             return;
// //         }

// //         const postData = querystring.stringify({
// //             grant_type: "authorization_code",
// //             code: code,
// //             redirect_uri: redirect_uri,
// //             client_id: client_id,
// //             client_secret: client_secret,
// //         });

// //         const options = {
// //             method: "POST",
// //             hostname: "accounts.spotify.com",
// //             path: "/api/token",
// //             headers: {
// //                 "Content-Type": "application/x-www-form-urlencoded",
// //                 Authorization: "Basic " + Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
// //             },
// //         };

// //         const request = https.request(options, (response) => {
// //             let body = "";

// //             response.on("data", (chunk) => (body += chunk));
// //             response.on("end", () => {
// //                 try {
// //                     const parsedBody = JSON.parse(body);
// //                     if (parsedBody.error) {
// //                         return res.status(400).json(parsedBody);
// //                     }

// //                     userTokens["default_user"] = parsedBody.access_token;

// //                     res.json({
// //                         access_token: parsedBody.access_token,
// //                         refresh_token: parsedBody.refresh_token,
// //                         expires_in: parsedBody.expires_in,
// //                     });
// //                 } catch (error) {
// //                     res.status(500).json({ error: "Failed to parse response" });
// //                 }
// //             });
// //         });

// //         request.on("error", (err) => res.status(500).json({ error: err.message }));
// //         request.write(postData);
// //         request.end();
// //     } catch (error) {
// //         console.error("Error in spotifyCallback:", error);
// //         res.status(500).json({ error: "Internal Server Error" });
// //     }
// // };

// export const getFavoriteArtists = async (req: Request, res: Response): Promise<void> => {
//     const accessToken = userTokens["default_user"];

//     if (!accessToken) {
//         res.status(401).json({ error: "Unauthorized - No Access Token" });
//         return;
//     }

//     try {
//         const response = await fetch("https://api.spotify.com/v1/me/top/artists", {
//             headers: { Authorization: `Bearer ${accessToken}` },
//         });

//         if (!response.ok) {
//             throw new Error(`Spotify API error: ${response.statusText}`);
//         }

//         const data = await response.json();
//         res.json(data);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to fetch favorite artists" });
//     }
// };

// export const getTopArtistGenres = async (req: Request, res: Response): Promise<void> => {
//     const accessToken = userTokens["default_user"];

//     if (!accessToken) {
//         res.status(401).json({ error: "Unauthorized - No Access Token" });
//         return;
//     }

//     try {
//         const response = await fetch("https://api.spotify.com/v1/me/top/artists?limit=5", {
//             headers: { Authorization: `Bearer ${accessToken}` },
//         });

//         if (!response.ok) {
//             throw new Error(`Spotify API error: ${response.statusText}`);
//         }

//         const data = await response.json();
//         const uniqueGenres: string[] = data.items
//             .flatMap((artist: any) => artist.genres)
//             .filter((genre, index, self) => self.indexOf(genre) === index);

//         res.json({ genres: uniqueGenres });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to fetch artist genres" });
//     }
// };

// import { Request, Response } from "express";
// import { User } from '../models/User';
// import querystring from "querystring";
// import dotenv from "dotenv";

// dotenv.config();

// const client_id = process.env.SPOTIFY_CLIENT_ID as string;
// const client_secret = process.env.SPOTIFY_CLIENT_SECRET as string;
// const redirect_uri = 'http://localhost:3000/spotify/callback';

// const generateRandomString = (length: number) => {
//     const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     return Array.from({ length }, () => possible.charAt(Math.floor(Math.random() * possible.length))).join('');
// };

// const refreshSpotifyToken = async (refreshToken: string) => {
//     const response = await fetch("https://accounts.spotify.com/api/token", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//             Authorization: "Basic " + Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
//         },
//         body: querystring.stringify({
//             grant_type: "refresh_token",
//             refresh_token: refreshToken,
//         }),
//     });

//     const data = await response.json();
//     return {
//         access_token: data.access_token,
//         expires_in: data.expires_in,
//     };
// };

// export const loginSpotify = (req: Request, res: Response) => {
//     const state = generateRandomString(16);
//     const scope = 'user-read-private user-read-email user-top-read';

//     res.redirect('https://accounts.spotify.com/authorize?' +
//         querystring.stringify({
//             response_type: 'code',
//             client_id: client_id,
//             scope: scope,
//             redirect_uri: redirect_uri,
//             state: state,
//         })
//     );
// };

// export const spotifyCallback = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const code = req.query.code as string;
//         if (!code) {
//             res.status(400).json({ error: "No authorization code provided" });
//             return;
//         }

//         const postData = querystring.stringify({
//             grant_type: "authorization_code",
//             code: code,
//             redirect_uri: redirect_uri,
//         });

//         const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/x-www-form-urlencoded",
//                 Authorization: "Basic " + Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
//             },
//             body: postData,
//         });

//         const tokenData = await tokenResponse.json();
//         const accessToken = tokenData.access_token;

//         if (!accessToken) {
//             res.status(400).json({ error: "Failed to retrieve access token" });
//             return;
//         }

//         // Fetch user profile
//         const profileRes = await fetch("https://api.spotify.com/v1/me", {
//             headers: { Authorization: `Bearer ${accessToken}` },
//         });
//         const profileData = await profileRes.json();

//         const name = profileData.display_name;
//         const email = profileData.email;

//         // Fetch top artists
//         const topArtistsRes = await fetch("https://api.spotify.com/v1/me/top/artists?limit=10", {
//             headers: { Authorization: `Bearer ${accessToken}` },
//         });
//         const topArtistsData = await topArtistsRes.json();

//         const genres = topArtistsData.items
//             .flatMap((artist: any) => artist.genres)
//             .filter((genre: string, i: number, arr: string[]) => arr.indexOf(genre) === i);

//         const artists = topArtistsData.items
//             .map((artist: any) => artist.name);

//         const expiresAt = new Date();
//         expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);

//         // Save or update user
//         const existingUser = await User.findOne({ email });

//         if (existingUser) {
//             existingUser.name = name;
//             existingUser.favoriteGenres = genres;
//             existingUser.favoriteArtists = artists;
//             existingUser.spotifyAccessToken = tokenData.access_token;
//             existingUser.spotifyRefreshToken = tokenData.refresh_token;
//             existingUser.spotifyTokenExpiresAt = expiresAt;
//             await existingUser.save();
//         } else {
//             const newUser = new User({
//                 name,
//                 email,
//                 favoriteGenres: genres,
//                 favoriteArtists: artists,
//                 spotifyAccessToken: tokenData.access_token,
//                 spotifyRefreshToken: tokenData.refresh_token,
//                 spotifyTokenExpiresAt: expiresAt,
//             });
//             await newUser.save();
//         }

//         res.json({
//             access_token: tokenData.access_token,
//             refresh_token: tokenData.refresh_token,
//             expires_in: tokenData.expires_in,
//         });
//     } catch (error) {
//         console.error("Error in spotifyCallback:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };

// const getValidAccessToken = async (email: string): Promise<string | null> => {
//     const user = await User.findOne({ email });

//     if (!user || !user.spotifyAccessToken) return null;

//     const now = new Date();
//     if (user.spotifyTokenExpiresAt && user.spotifyTokenExpiresAt > now) {
//         return user.spotifyAccessToken;
//     }

//     if (user.spotifyRefreshToken) {
//         try {
//             const refreshed = await refreshSpotifyToken(user.spotifyRefreshToken);
//             user.spotifyAccessToken = refreshed.access_token;
//             user.spotifyTokenExpiresAt = new Date(Date.now() + refreshed.expires_in * 1000);
//             await user.save();
//             return refreshed.access_token;
//         } catch (err) {
//             console.error("Failed to refresh token:", err);
//             return null;
//         }
//     }

//     return null;
// };

// export const getFavoriteArtists = async (req: Request, res: Response): Promise<void> => {
//     const email = req.query.email as string;
//     const accessToken = await getValidAccessToken(email);

//     if (!accessToken) {
//         res.status(401).json({ error: "Unauthorized - No valid access token" });
//         return;
//     }

//     try {
//         const response = await fetch("https://api.spotify.com/v1/me/top/artists", {
//             headers: { Authorization: `Bearer ${accessToken}` },
//         });

//         if (!response.ok) {
//             throw new Error(`Spotify API error: ${response.statusText}`);
//         }

//         const data = await response.json();
//         res.json(data);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to fetch favorite artists" });
//     }
// };

// export const getTopArtistGenres = async (req: Request, res: Response): Promise<void> => {
//     const email = req.query.email as string;

//     console.log("Email:", email);
    
//     const accessToken = await getValidAccessToken(email);

//     if (!accessToken) {
//         res.status(401).json({ error: "Unauthorized - No valid access token" });
//         return;
//     }

//     try {
//         const response = await fetch("https://api.spotify.com/v1/me/top/artists?limit=5", {
//             headers: { Authorization: `Bearer ${accessToken}` },
//         });

//         if (!response.ok) {
//             throw new Error(`Spotify API error: ${response.statusText}`);
//         }

//         const data = await response.json();
//         const uniqueGenres: string[] = data.items
//             .flatMap((artist: any) => artist.genres)
//             .filter((genre, index, self) => self.indexOf(genre) === index);

//         res.json({ genres: uniqueGenres });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to fetch artist genres" });
//     }
// };
