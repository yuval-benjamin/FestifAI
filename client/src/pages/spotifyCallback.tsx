import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { parseSpotifyTokens } from "../services/spotifyService";
import { ClipLoader } from 'react-spinners';
import { useUser } from "../context/UserContext";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";

const SpotifyCallback = () => {
  const navigate = useNavigate();
  const hasParsed = useRef(false);
  const { setUser } = useUser();

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
        const response = await axiosInstance.get('/spotify/getUserData', {
          params: { access_token: accessToken }
        });
        const data = response.data;
        setUser(data.name, data.email);
        navigate("/preferences");
      } catch (error) {
        console.error("Sync error:", error);
      }
    }
  };

  return (
    <>
      <h1 className="display-1 bangers-regular" style={{ color: "white" }}>🎶 logging in with Spotify...</h1>
      <div className="sweet-loading d-flex flex-row justify-content-center align-items-center">
        <ClipLoader loading={true} size={150} color="#FFFFFF" />
      </div>
    </>
  );
};

export default SpotifyCallback;
