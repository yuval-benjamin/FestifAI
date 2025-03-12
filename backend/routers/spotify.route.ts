import express from "express";
import { spotifyCallback, loginSpotify, getFavoriteArtists } from "../controllers/spotify.controller";

export const spotifyRouter = express.Router();

spotifyRouter.get("/login", loginSpotify);
spotifyRouter.get("/callback", async (req, res) => spotifyCallback(req, res)); // Fix here
spotifyRouter.get("/favorite-artists", async (req, res) => getFavoriteArtists(req, res)); // Fix here
