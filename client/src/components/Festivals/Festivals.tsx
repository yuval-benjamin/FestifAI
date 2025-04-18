import React, { FC, Fragment, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AmadeusFlightOffer, AppContext, FestivalInterface, FlightInterface, PackageInterface, PackageEnum } from '../../App';
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
    const { data } = await axios.get<{ data: AmadeusFlightOffer[] }>(`http://localhost:3000/amadeus/flight-offers`, {
      params: {
        originLocationCode: "TLV",
        destinationLocationCode: festival.locationCode,
        departureDate: festival.startDate,
        returnDate: festival.endDate,
        adults: 1,
      },
      headers: {
        AMADEUS_ACCESS_TOKEN: `${amadeusAccessToken}`
      },
    })
    
    data.data.sort((flightOfferA, flightOfferB) => parseInt(flightOfferA.price.total) - parseInt(flightOfferB.price.total))
    data.data[0].packageType = PackageEnum.LITE,
    data.data[1].packageType = PackageEnum.STANDARD,
    data.data[2].packageType = PackageEnum.PREMIUM

    const packages = data.data.map((flightOffer: AmadeusFlightOffer) => ({
      startDay: (flightOffer.itineraries[0].segments[0].departure.at).split("T")[0],
      price: flightOffer.price.total,
      endDay: (flightOffer.itineraries[0].segments[1].arrival.at).split("T")[0],
      _id: flightOffer.id,
      festivalId: festival.name,
      flights: {
        departure: {
          origin: flightOffer.itineraries[0].segments[0].departure.iataCode,
          destination: flightOffer.itineraries[0].segments[0].arrival.iataCode,
          departureDate: (flightOffer.itineraries[0].segments[0].departure.at),
          arrivalDate: (flightOffer.itineraries[0].segments[0].arrival.at),
          airline: flightOffer.itineraries[0].segments[0].operating.carrierCode
        },
        return: {
          origin: flightOffer.itineraries[0].segments[1].departure.iataCode,
          destination: flightOffer.itineraries[0].segments[1].arrival.iataCode,
          departureDate: flightOffer.itineraries[0].segments[1].departure.at,
          arrivalDate: flightOffer.itineraries[0].segments[1].arrival.at,
          airline: flightOffer.itineraries[0].segments[1].operating.carrierCode
        }
      },
      accommodation: "-",
      checkedBags: flightOffer.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity,
      class: flightOffer.travelerPricings[0].fareDetailsBySegment[0].class,
      packageType: flightOffer.packageType,
    }))
    setPackages?.(packages);
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
              <p className="card-text">dates: {festival.startDate}, {festival.endDate}</p>
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
