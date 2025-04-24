
import { SpotifyIcon } from "../assets/icons";
import { loginWithSpotify } from "../services/spotifyService";
import { FC, Fragment } from "react";
import { useNavigate } from 'react-router-dom';

export const Homepage: FC = () => {
  const navigate = useNavigate();

export const Homepage: FC = () => {
  return (
    <div
      className="container-inline d-flex flex-column justify-content-center align-items-center text-white opacity-75"
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
        onClick={loginWithSpotify}  // This only triggers the Spotify login flow
      >
        Login with spotify <SpotifyIcon />
      </button>
    </div>
      <button type="button" className="btn btn-success bangers-regular btn-lg" onClick={
        () => navigate('/preferences')
      }
  );
};

export default Homepage;
