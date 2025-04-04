import { FC } from "react";
import { SpotifyIcon } from "../assets/icons";

const Homepage :FC= () => {
  return (
    <div className="container-inline d-flex flex-column justify-content-center align-items-center text-white opacity-75" 
     style={{height: "100vh", backgroundImage:"url(/festival-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center"}}>
      <p className="fs-1 bangers-regular">WELCOME TO</p>
      <h1 className="display-1 bangers-regular">FestifAI</h1>
      <p className="fs-1 bangers-regular">YOUR FESTIVAL PLANNER</p>
      <button type="button" className="btn btn-success bangers-regular btn-lg">Login with spotify <SpotifyIcon /></button>  
    </div>
  );
}

export default Homepage;

