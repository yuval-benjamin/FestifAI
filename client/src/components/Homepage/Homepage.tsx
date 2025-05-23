import { FC } from "react";
import { useNavigate } from 'react-router-dom';
import { loginWithSpotify } from "../../services/spotifyService";
import { SpotifyIcon } from "../../assets/icons";

export const Homepage: FC = () => {
  const navigate = useNavigate();
  localStorage.setItem("spotify_user_name", "");
  localStorage.setItem("spotify_user_email", "");
  return (
    <div
      className="container-inline d-flex flex-column justify-content-center align-items-center text-white"
      style={{
        height: "100vh",
        backgroundImage: "url(/festival-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <p className="fs-1 bangers-regular">WELCOME TO</p>
      <h1 className="display-1 bangers-regular">FestifAI</h1>
      <p className="fs-1 bangers-regular">YOUR FESTIVAL PLANNER</p>
      <button
        type="button"
        className="btn btn-success bangers-regular btn-lg"
        onClick={loginWithSpotify}
      >
        Login with Spotify <SpotifyIcon />
      </button>
      <button
        type="button"
        className="btn btn-success bangers-regular btn-lg mt-3"
        onClick={() => navigate('/preferences')}
      >
        Go to Preferences without soptify</button> </div>

   );
};

export default Homepage;