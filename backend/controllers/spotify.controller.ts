import { Request, Response } from "express";
import querystring from "querystring";
import https from "https";
import dotenv from "dotenv";

dotenv.config();
const userTokens: Record<string, string> = {}; // Temporary token store

const client_id = process.env.SPOTIFY_CLIENT_ID as string;
console.log(client_id);
const client_secret = process.env.SPOTIFY_CLIENT_SECRET as string;
const redirect_uri = 'http://localhost:3000/spotify/callback';

const generateRandomString = (length: number) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => possible.charAt(Math.floor(Math.random() * possible.length))).join('');
};

export const loginSpotify = (req: Request, res: Response) => {
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email user-top-read';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state,
        })
    );
};

export const spotifyCallback = async (req: Request, res: Response): Promise<void> => {
    try {
        const code = req.query.code as string;
        if (!code) {
            res.status(400).json({ error: "No authorization code provided" });
            return;
        }

        const postData = querystring.stringify({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: redirect_uri,
            client_id: client_id,
            client_secret: client_secret,
        });

        const options = {
            method: "POST",
            hostname: "accounts.spotify.com",
            path: "/api/token",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
            },
        };

        const request = https.request(options, (response) => {
            let body = "";

            response.on("data", (chunk) => (body += chunk));
            response.on("end", () => {
                try {
                    const parsedBody = JSON.parse(body);
                    if (parsedBody.error) {
                        return res.status(400).json(parsedBody);
                    }

                    userTokens["default_user"] = parsedBody.access_token;

                    res.json({
                        access_token: parsedBody.access_token,
                        refresh_token: parsedBody.refresh_token,
                        expires_in: parsedBody.expires_in,
                    });
                } catch (error) {
                    res.status(500).json({ error: "Failed to parse response" });
                }
            });
        });

        request.on("error", (err) => res.status(500).json({ error: err.message }));
        request.write(postData);
        request.end();
    } catch (error) {
        console.error("Error in spotifyCallback:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getFavoriteArtists = async (req: Request, res: Response): Promise<void> => {
    const accessToken = userTokens["default_user"];

    if (!accessToken) {
        res.status(401).json({ error: "Unauthorized - No Access Token" });
        return;
    }

    try {
        const response = await fetch("https://api.spotify.com/v1/me/top/artists", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
            throw new Error(`Spotify API error: ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch favorite artists" });
    }
};

