import React, { FC, Fragment, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext, FestivalInterface, PackageInterface } from '../../App';
import axios from 'axios';

export const Festivals: FC = () => {
  const {festivals, setPackages} = useContext(AppContext)
  const navigate = useNavigate();


  const fetchAmadeusToken = async (festival: FestivalInterface) => {
      const { data } = await axios.post<{ access_token: string }>(`http://localhost:3000/amadeus`)
      console.log(data.access_token)
      fetchFlights(festival, data.access_token)
    };
      
  const fetchFlights = async (festival: FestivalInterface, amadeusAccessToken: string) => {
    const { data } = await axios.get<{ packages: PackageInterface[] }>(`http://localhost:3000/amadeus/flight-offers`, {
      data: {
        festivalName: festival.name,
        originLocationCode: "TLV",
        destinationLocationCode: "CDG",
        departureDate: festival.startDate,
        returnDate: festival.endDate,
        adults: 1,
      },
      headers: {
        AMADEUS_ACCESS_TOKEN: `${amadeusAccessToken}`
      },
    })
    console.log(data)
    setPackages?.(data.packages);
    navigate(`/festivals/package`)
  }

  return (
    <Fragment>
      <h1 className="display-1 bangers-regular" style={{ color: "black" }}>choose your festival</h1>
      <div className="d-flex flex-row justify-content-center align-items-center">
        {festivals?.map((festival) => (
          <div
            key={festival.name}
            className="card text-center m-2"
            style={{
              width: "20rem",
              height: "22rem",
              backgroundColor: "rgba(31, 31, 61, 0.8)",
              color: "white",
              border: "none",
            }}
            onClick={() => fetchAmadeusToken(festival)}>
            <div className="card-body">
              <h5 className="card-title bangers-regular">{festival.name}</h5>
              <p className="card-text">dates: {festival.startDate}-{festival.endDate}</p>
              <p className="card-text">location: {festival.location}</p>
              {/* <p className="card-text">estimated cost: ${festival.price}</p> */}
              <a href={festival.website} className="btn btn-primary">Checkout {festival.name} website</a>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};
