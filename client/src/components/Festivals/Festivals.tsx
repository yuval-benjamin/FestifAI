import React, { FC, useState } from 'react';
import { FestivalInterface } from '../../App';
import { useNavigate } from 'react-router-dom';


interface FestivalsProps {
}

export const Festivals: FC<FestivalsProps> = () => {
  let [festivals] = useState<FestivalInterface[]>([]);
  const navigate = useNavigate();
  festivals = [
    {
      _id: "1",
      link: "https://www.coachella.com/",
      name: "Coachella",
      location: "Indio, California",
      genre: "Rock, Pop, Hip-Hop",
      price: 500,
      startDay: "April 14, 2023",
      endDay: "April 16, 2023"
    },
    {
      _id: "2",
      link: "https://www.lollapalooza.com/",
      name: "Lollapalooza",
      location: "Chicago, Illinois",
      genre: "Rock, Pop, Electronic",
      price: 400,
      startDay: "July 28, 2023",
      endDay: "July 31, 2023"
    },
    {
      _id: "3",
      link: "https://www.bonnaroo.com/",
      name: "Bonnaroo",
      location: "Manchester, Tennessee",
      genre: "Rock, Indie, Electronic",
      price: 350,
      startDay: "June 15, 2023",
      endDay: "June 18, 2023"
    }
  ]


return(
    <div className="container-inline d-flex flex-column justify-content-center align-items-center text-white opacity-75" 
     style={{height: "100vh", backgroundImage:"url(/festival-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center"}}>
      <h1 className="display-1 bangers-regular">choose your festival</h1>
      <div className="d-flex flex-row justify-content-center align-items-center">
    {festivals.map((festival) => (
      <div key={festival._id} className="card text-center m-2" style={{
        width: "20rem", 
        height: "22rem",
        backgroundColor: "rgba(31, 31, 61, 0.8)", 
        color: "white", 
        border: "none", 
      }}  onClick={() => navigate(`/festivals/package`)}>
        <div className="card-body">
          <h5 className="card-title bangers-regular">{festival.name}</h5>
          <p className="card-text">dates: {festival.startDay}-{festival.endDay}</p>
          <p className="card-text">location: {festival.location}</p>
          <p className="card-text">genre: {festival.genre}</p>
          <p className="card-text">estimated cost: ${festival.price}</p>
          <a href={festival.link} className="btn btn-primary">Checkout {festival.name} website</a>
        </div>
      </div>
    ))}
    </div>
    </div>
  );
};
