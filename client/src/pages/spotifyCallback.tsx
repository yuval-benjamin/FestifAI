import { useEffect, useRef, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { parseSpotifyTokens } from "../services/spotifyService";
import { ClipLoader } from 'react-spinners';


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

        // Save name and email locally
        localStorage.setItem("spotify_user_name", data.name);
        localStorage.setItem("spotify_user_email", data.email);
        window.dispatchEvent(new Event("spotify_user_name_updated"));

        navigate("/preferences");
      } catch (error) {
        console.error("Sync error:", error);
      }
    }
  };

  return (
    <Fragment>
      <h1 className="display-1 bangers-regular" style={{ color: "white" }}>login in with Spotify...</h1>
      <div className="sweet-loading d-flex flex-row justify-content-center align-items-center">
        <ClipLoader
          loading={true}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
          color="#FFFFFF"
        />
      </div>
    </Fragment>
  );
};

export default SpotifyCallback;
