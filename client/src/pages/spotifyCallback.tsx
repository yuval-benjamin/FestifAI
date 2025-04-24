import { useEffect, useRef  } from "react";
import { useNavigate } from "react-router-dom";
import { parseSpotifyTokens } from "../services/spotifyService";

const SpotifyCallback = () => {
  const navigate = useNavigate();
  const hasParsed = useRef(false);

  useEffect(() => {
    if (hasParsed.current) return;
    hasParsed.current = true;

    const success = parseSpotifyTokens();
    if (success) {
      fetchUserData();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserData = async () => {
    const accessToken = localStorage.getItem("spotify_access_token");
    if (accessToken) {
      try {
        const response = await fetch(`http://localhost:3000/spotify/getUserData?access_token=${accessToken}`);
        const data = await response.json();
        navigate("/preferences");
      } catch (error) {
        console.error("Sync error:", error);
      }
    }
  };

  return <p>Logging in with Spotify...</p>; 
};

export default SpotifyCallback;
