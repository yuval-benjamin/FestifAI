import { FC, Fragment } from "react";
import { SpotifyIcon } from "../assets/icons";
import { useNavigate } from 'react-router-dom';

export const Homepage: FC = () => {
  const navigate = useNavigate();

  return (
    <Fragment>
      <p className="fs-1 bangers-regular">
        WELCOME TO
      </p>
      <h1 className="display-1 bangers-regular">FestifAI</h1>
      <p className="fs-1 bangers-regular">YOUR FESTIVAL PLANNER</p>
      <button type="button" className="btn btn-success bangers-regular btn-lg" onClick={
        () => navigate('/preferences')
      }>Login with spotify <SpotifyIcon /></button>
    </Fragment>
  );
}

export default Homepage;

