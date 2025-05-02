import React, { FC, Fragment, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AmadeusFlightOffer, AppContext, FestivalInterface, FlightInterface, PackageInterface, PackageEnum } from '../../App';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

export const Festivals: FC = () => {
  const {festivals, setPackages} = useContext(AppContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); 

  const fetchAmadeusToken = async (festival: FestivalInterface) => {
    setIsLoading(true)
      const { data } = await axios.post<{ access_token: string }>(`http://localhost:3000/amadeus`)
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
      endDay: (flightOffer.itineraries[1].segments[1].arrival.at).split("T")[0],
      _id: flightOffer.id,
      festivalId: festival.name,
      flights: {
        departure: [{
          origin: flightOffer.itineraries[0].segments[0].departure.iataCode,
          destination: flightOffer.itineraries[0].segments[0].arrival.iataCode,
          departureDate: (flightOffer.itineraries[0].segments[0].departure.at),
          arrivalDate: (flightOffer.itineraries[0].segments[0].arrival.at),
          airline: flightOffer.itineraries[0].segments[0].operating?.carrierCode ?? flightOffer.itineraries[0].segments[0].carrierCode
        },
      {
        origin: flightOffer.itineraries[0].segments[1].departure.iataCode,
        destination: flightOffer.itineraries[0].segments[1].arrival.iataCode,
        departureDate: (flightOffer.itineraries[0].segments[1].departure.at),
        arrivalDate: (flightOffer.itineraries[0].segments[1].arrival.at),
        airline: flightOffer.itineraries[0].segments[1].operating?.carrierCode ?? flightOffer.itineraries[0].segments[0].carrierCode
      }],
        return: [{
          origin: flightOffer.itineraries[1].segments[0].departure.iataCode,
          destination: flightOffer.itineraries[1].segments[0].arrival.iataCode,
          departureDate: flightOffer.itineraries[1].segments[0].departure.at,
          arrivalDate: flightOffer.itineraries[1].segments[0].arrival.at,
          airline: flightOffer.itineraries[1].segments[0].operating?.carrierCode ?? flightOffer.itineraries[0].segments[0].carrierCode
        }, {
          origin: flightOffer.itineraries[1].segments[1].departure.iataCode,
          destination: flightOffer.itineraries[1].segments[1].arrival.iataCode,
          departureDate: flightOffer.itineraries[1].segments[1].departure.at,
          arrivalDate: flightOffer.itineraries[1].segments[1].arrival.at,
          airline: flightOffer.itineraries[1].segments[1].operating?.carrierCode ?? flightOffer.itineraries[0].segments[0].carrierCode
        
        }]
      },
      accommodation: "-",
      checkedBags: flightOffer.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity,
      class: flightOffer.travelerPricings[0].fareDetailsBySegment[0].cabin,
      packageType: flightOffer.packageType,
    }))
    fetchHotels(packages, amadeusAccessToken, festival.locationCode)
  }

  const fetchHotels = async (packages: PackageInterface[], amadeusAccessToken: string, cityCode: string) => {

    const { data } = await axios.get<{ data: any[] }>(`http://localhost:3000/amadeus/hotels`, {
    params: {
      cityCode
    },
    headers: {
      AMADEUS_ACCESS_TOKEN: `${amadeusAccessToken}`
    }
  })
  data.data.splice(10, data.data.length)
  const hotels = data.data.map((hotelOffer) =>  hotelOffer.hotelId)
  fetchHotelOffers(amadeusAccessToken, packages, hotels, cityCode)
  }

  const fetchHotelOffers = async(amadeusAccessToken: string, packages: PackageInterface[], hotelIds: any[], cityCode: string) => {
    const { data } = await axios.get<{ data: any[], dictionaries: any }>(`http://localhost:3000/amadeus/hotel-offers`, {
      params: {
        hotelIds,
        cityCode,
        checkInDate: packages[0].startDay,
        checkOutDate: packages[0].endDay,
        adults: 1,
      },
      headers: {
        AMADEUS_ACCESS_TOKEN: `${amadeusAccessToken}`
      },
    })

  
    data.data.filter((hotelOffer) => hotelOffer.isAvalible)
    let fullPackages = []
    if(data.data.length >= 3) {
      data.data[0].offers[0].price.total = parseInt(data.data[0].offers[0].price.total) * parseInt(data.dictionaries.currencyConversionLookupRates[data.data[0].offers[0].price.currency].rate)
      data.data[1].offers[0].price.total = parseInt(data.data[1].offers[0].price.total)* parseInt(data.dictionaries.currencyConversionLookupRates[data.data[1].offers[0].price.currency].rate)
      data.data[2].offers[0].price.total = parseInt(data.data[2].offers[0].price.total) * parseInt(data.dictionaries.currencyConversionLookupRates[data.data[2].offers[0].price.currency].rate)  
    data.data.sort((hotelA, hotelB) => (hotelA.offers[0].price.total) - (hotelB.offers[0].price.total))
    packages[0].accommodation = data.data[0].hotel.name
    packages[1].accommodation = data.data[1].hotel.name
    packages[2].accommodation = data.data[2].hotel.name

     fullPackages = packages.map((packageItem, index) => ({
      ...packageItem,
      price: (parseInt(packageItem.price) + parseInt(data.data[index].offers[0].price.total)).toString(),
    }))
  } else {
    fullPackages = packages.map((packageItem, index) => ({
      ...packageItem,
      accommodation: data.data[0].hotel.name,
      price: (parseInt(packageItem.price) + parseInt(data.data[0].offers[0].price.total)).toString(),
    }))
  }
  setIsLoading(false)
  setPackages?.(fullPackages);
    navigate(`/festivals/package`)
  }

  return (
    isLoading ? 
    <Fragment>
      <h1 className="display-1 bangers-regular" style={{ color: "black" }}>customizing your festival packages...</h1>
      <div className="sweet-loading d-flex flex-row justify-content-center align-items-center">
    <ClipLoader
      loading={true}
      size={150}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  </div>
  </Fragment>  :
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
