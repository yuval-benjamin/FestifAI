import _ from "lodash";
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
  data.data[0].packageType = PackageEnum.LITE;
  data.data[1].packageType = PackageEnum.STANDARD;
  data.data[2].packageType = PackageEnum.PREMIUM;


  const packages = data.data.map((flightOffer: AmadeusFlightOffer) => ({
    startDay: (flightOffer.itineraries[0].segments[0].departure.at).split("T")[0],
    price: flightOffer.price.total,
    endDay: flightOffer.itineraries[1].segments[1] ? (flightOffer.itineraries[1].segments[1].arrival.at).split("T")[0] : (flightOffer.itineraries[0].segments[0].arrival.at).split("T")[0],
    _id: flightOffer.id,
    festivalId: selectedFestival?.name ?? "Unknown Festival",
    flights: {
      departure:
        flightOffer.itineraries[0].segments.map((segment: any) => ({
          origin: segment.departure.iataCode,
          destination: segment.arrival.iataCode,
          departureDate: segment.departure.at,
          arrivalDate: segment.arrival.at,
          airline: data.dictionaries.carriers[segment.operating?.carrierCode ?? segment.carrierCode]

        })),
      return: flightOffer.itineraries[1].segments.map((segment: any) => ({
        origin: segment.departure.iataCode,
        destination: segment.arrival.iataCode,
        departureDate: segment.departure.at,
        arrivalDate: segment.arrival.at,
        airline: data.dictionaries.carriers[segment.operating?.carrierCode ?? segment.carrierCode]
      })),
    },
    accommodation: "no avalible accommodation",
    checkedBags: flightOffer.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity,
    class: flightOffer.travelerPricings[0].fareDetailsBySegment[0].cabin,
    packageType: flightOffer.packageType,
    hotelId: "",
    festivalLink: selectedFestival.website ?? ""
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
  if (!data || !data.data || data.data.length === 0) {
    return shallowFlights
  }
  data.data.splice(20, data.data.length)
  const hotels = data.data.map((hotelOffer) => hotelOffer.hotelId)
  return fetchHotelOffers(hotels, cityCode)
}

const fetchHotelOffers = async (hotelIds: any[], cityCode: string | undefined) => {
  try {
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


    if (_.isEmpty(data?.data?.length)) {
      return shallowFlights
    }
    let fullPackages: PackageInterface[] = [];

    data.data.filter((hotelOffer) => hotelOffer.isAvalible)
    if (data?.data?.length >= 3) {
      data.data.sort((hotelA, hotelB) => (hotelA.offers[0].price.total) - (hotelB.offers[0].price.total))

      data.data.map((hotelOffer) => {
        hotelOffer.offers[0].price.total = parseInt(hotelOffer.offers[0].price.total) *
          parseInt(data.dictionaries.currencyConversionLookupRates[hotelOffer.offers[0].price.currency].rate) // Convert to ILS
      })

      fullPackages = shallowFlights.map((flightPackage, index) => ({
        ...flightPackage,
        accommodation: data.data[index].hotel.name,
        hotelId: data.data[index].hotel.hotelId,
        price: (parseInt(flightPackage.price) + parseInt(data.data[index].offers[0].price.total)).toString(), // Add hotel price to flight package price
      }))

    } else {
      fullPackages = shallowFlights.map((packageItem) => ({
        ...packageItem,
        accommodation: data.data[0].hotel.name,
        price: (parseInt(packageItem.price) + parseInt(data.data[0].offers[0].price.total)).toString(),
        hotelId: data.data[0].hotel.hotelId,
      }))
    }
    return fetchHotelRatings(fullPackages)
  } catch (error) {
    return shallowFlights
  }
}

const fetchHotelRatings = async (packagesWithoutRating: PackageInterface[]): Promise<PackageInterface[]> => {
  const { data } = await axios.get<{ data: any[] }>(`http://localhost:3000/amadeus/hotel-ratings`, {
    params: {
      hotelIds: packagesWithoutRating.map((packageItem) => packageItem.hotelId),
    },
    headers: {
      AMADEUS_ACCESS_TOKEN: retrieveAmadeusTokenFromStorage()
    }
  })

  packagesWithoutRating = packagesWithoutRating.map((packageItem) => ({
    ...packageItem,
    hotelRating: 5
    // hotelRating: data?.data ? (data?.data?.find((hotelRating) => hotelRating.hotelId === packageItem.hotelId)?.overallRating ?? 0)/20 : 0 // Convert to 1-5 stars
  }))

  return packagesWithoutRating;
}