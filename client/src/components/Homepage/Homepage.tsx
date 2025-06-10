import { FC, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { loginWithSpotify } from "../../services/spotifyService";
import { SpotifyIcon } from "../../assets/icons";

export const Homepage: FC = () => {
  const navigate = useNavigate();
  const [showSpotifyLogin, setShowSpotifyLogin] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("user_name");
    const storedEmail = localStorage.getItem("user_email");

    if (!storedName || !storedEmail) {
      setShowSpotifyLogin(true);
    }
  }, []);

  return (
    <div className="container-inline d-flex flex-column justify-content-center align-items-center text-white">
      <p className="fs-1 bangers-regular">WELCOME TO</p>
      <h1 className="display-1 bangers-regular">FestifAI</h1>
      <p className="fs-1 bangers-regular">YOUR FESTIVAL PLANNER</p>

      {showSpotifyLogin && (
        <button
          type="button"
          className="btn btn-success bangers-regular btn-lg"
          onClick={loginWithSpotify}
        >
          Login with Spotify <SpotifyIcon />
        </button>
      )}

{!showSpotifyLogin && (
      <button
        type="button"
        className="btn btn-success bangers-regular btn-lg mt-3"
        onClick={() => navigate('/preferences')}
      >
        Start Planning Your Festival
      </button>
  )}
      </div>
  );
};

export default Homepage;
