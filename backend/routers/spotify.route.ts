import express from "express";
// import { getTopArtistGenres, spotifyCallback, loginSpotify, getFavoriteArtists } from "../controllers/spotify.controller";
import { syncSpotifyUser,getUserTopArtists } from "../controllers/spotify.controller";

export const spotifyRouter = express.Router();

spotifyRouter.get("/getUserData", syncSpotifyUser);
spotifyRouter.get("/getUserArtists", getUserTopArtists);

// spotifyRouter.get("/callback", async (req, res) => spotifyCallback(req, res));
// spotifyRouter.get("/favorite-artists", async (req, res) => getFavoriteArtists(req, res));
// spotifyRouter.get("/top-genres", getTopArtistGenres);
