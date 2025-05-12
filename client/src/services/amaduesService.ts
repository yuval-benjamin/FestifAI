import { PackageInterface, FestivalInterface, AmadeusFlightOffer, PackageEnum } from "../App"; 
import axios from "axios";


 let shallowFlights: PackageInterface[];
  let selectedFestival: FestivalInterface;

  const retrieveAmadeusTokenFromStorage = () => localStorage.getItem("AMADEUS_ACCESS_TOKEN")

  export const fetchAmadeusToken = async (festival: FestivalInterface) => {
    selectedFestival = (festival)
      const { data } = await axios.post<{ access_token: string }>(`http://localhost:3000/amadeus`)
      localStorage.setItem("AMADEUS_ACCESS_TOKEN", data.access_token);
      return fetchFlights()      
    };
      
  const fetchFlights = async () => {
    const { data } = await axios.get<{ data: AmadeusFlightOffer[], dictionaries: any }>(`http://localhost:3000/amadeus/flight-offers`, {
      params: {
        originLocationCode: "TLV",
        destinationLocationCode: selectedFestival?.locationCode,
        departureDate: selectedFestival?.startDate,
        returnDate: selectedFestival?.endDate,
        adults: 1,
      },
      headers: {
        AMADEUS_ACCESS_TOKEN: retrieveAmadeusTokenFromStorage()
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
      festivalId: selectedFestival?.name ?? "Unknown Festival",
      flights: {
        departure: [{
          origin: flightOffer.itineraries[0].segments[0].departure.iataCode,
          destination: flightOffer.itineraries[0].segments[0].arrival.iataCode,
          departureDate: (flightOffer.itineraries[0].segments[0].departure.at),
          arrivalDate: (flightOffer.itineraries[0].segments[0].arrival.at),
          airline: data.dictionaries.carriers[flightOffer.itineraries[0].segments[0].operating?.carrierCode ?? flightOffer.itineraries[0].segments[0].carrierCode]
        },
      {
        origin: flightOffer.itineraries[0].segments[1].departure.iataCode,
        destination: flightOffer.itineraries[0].segments[1].arrival.iataCode,
        departureDate: (flightOffer.itineraries[0].segments[1].departure.at),
        arrivalDate: (flightOffer.itineraries[0].segments[1].arrival.at),
        airline: data.dictionaries.carriers[flightOffer.itineraries[0].segments[1].operating?.carrierCode ?? flightOffer.itineraries[0].segments[0].carrierCode]
      }],
        return: [{
          origin: flightOffer.itineraries[1].segments[0].departure.iataCode,
          destination: flightOffer.itineraries[1].segments[0].arrival.iataCode,
          departureDate: flightOffer.itineraries[1].segments[0].departure.at,
          arrivalDate: flightOffer.itineraries[1].segments[0].arrival.at,
          airline: data.dictionaries.carriers[flightOffer.itineraries[1].segments[0].operating?.carrierCode ?? flightOffer.itineraries[0].segments[0].carrierCode]
        }, {
          origin: flightOffer.itineraries[1].segments[1].departure.iataCode,
          destination: flightOffer.itineraries[1].segments[1].arrival.iataCode,
          departureDate: flightOffer.itineraries[1].segments[1].departure.at,
          arrivalDate: flightOffer.itineraries[1].segments[1].arrival.at,
          airline: data.dictionaries.carriers[flightOffer.itineraries[1].segments[1].operating?.carrierCode ?? flightOffer.itineraries[0].segments[0].carrierCode]
        
        }]
      },
      accommodation: "-",
      checkedBags: flightOffer.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity,
      class: flightOffer.travelerPricings[0].fareDetailsBySegment[0].cabin,
      packageType: flightOffer.packageType,
    }))
    shallowFlights = packages;
    return fetchHotels(selectedFestival?.locationCode)
  }

  const fetchHotels = async (cityCode: string | undefined) => {

    const { data } = await axios.get<{ data: any[] }>(`http://localhost:3000/amadeus/hotels`, {
    params: {
      cityCode
    },
    headers: {
      AMADEUS_ACCESS_TOKEN: retrieveAmadeusTokenFromStorage()
    }
  })
  data.data.splice(20, data.data.length)
  const hotels = data.data.map((hotelOffer) =>  hotelOffer.hotelId)
  return fetchHotelOffers(hotels, cityCode)
  }

  const fetchHotelOffers = async(hotelIds: any[], cityCode: string | undefined) => {
    const { data } = await axios.get<{ data: any[], dictionaries: any }>(`http://localhost:3000/amadeus/hotel-offers`, {
      params: {
        hotelIds,
        cityCode,
        checkInDate: shallowFlights[0].startDay,
        checkOutDate: shallowFlights[0].endDay,
        adults: 1,
      },
      headers: {
        AMADEUS_ACCESS_TOKEN: retrieveAmadeusTokenFromStorage()
      },
    })

  
    data.data.filter((hotelOffer) => hotelOffer.isAvalible)
    let fullPackages = []
    if (data.data.length >= 3) {
      data.data.sort((hotelA, hotelB) => (hotelA.offers[0].price.total) - (hotelB.offers[0].price.total))
      
      data.data[0].offers[0].price.total = parseInt(data.data[0].offers[0].price.total) * parseInt(data.dictionaries.currencyConversionLookupRates[data.data[0].offers[0].price.currency].rate)
      data.data[1].offers[0].price.total = parseInt(data.data[1].offers[0].price.total)* parseInt(data.dictionaries.currencyConversionLookupRates[data.data[1].offers[0].price.currency].rate)
      data.data[2].offers[0].price.total = parseInt(data.data[2].offers[0].price.total) * parseInt(data.dictionaries.currencyConversionLookupRates[data.data[2].offers[0].price.currency].rate)  

      shallowFlights[0].accommodation = data.data[0].hotel.name
      shallowFlights[1].accommodation = data.data[1].hotel.name
      shallowFlights[2].accommodation = data.data[2].hotel.name

     fullPackages = shallowFlights.map((packageItem, index) => ({
      ...packageItem,
      price: (parseInt(packageItem.price) + parseInt(data.data[index].offers[0].price.total)).toString(),
    }))

    shallowFlights.map((packageItem, index) => 
    ({
      ...packageItem,
      price: (parseInt(packageItem.price) + parseInt(data.data[index].offers[0].price.total)).toString(),
    }))    
    } else {
      fullPackages = shallowFlights.map((packageItem) => ({
        ...packageItem,
        accommodation: data.data[0].hotel.name,
        price: (parseInt(packageItem.price) + parseInt(data.data[0].offers[0].price.total)).toString(),
      }))
    }
    return fullPackages
}