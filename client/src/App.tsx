import './App.css'
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import theme from './theme'; // Adjust the path to your theme file

import { createContext, useState } from 'react';
import { Festivals } from './components/Festivals/Festivals';
import { Packages } from './components/Packages';
import { Preferences } from './components/Preferences/Preferences';
import SpotifyCallback from "./pages/spotifyCallback";
import Homepage from './components/Homepage/Homepage';
import { Checkout } from './components/Checkout/Checkout';
import { FestivalProvider } from './components/FetchFestivalsContext';

export function App() {
  const [user, setUser] = useState<User>();
  const [festivals, setFestivals] = useState<FestivalInterface[]>([]);
  const [packages, setPackages] = useState<PackageInterface[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageInterface>({} as PackageInterface);

  return (
    <ThemeProvider theme={theme}>
      <FestivalProvider>
        <AppContext.Provider
          value={{
            setFestivals,
            festivals,
            user,
            setUser,
            packages,
            setPackages,
            selectedPackage,
            setSelectedPackage
          }}>
          <div className="container-inline d-flex flex-column justify-content-center align-items-center text-white"
            style={{ height: "100vh", backgroundImage: "url(/festival-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/festivals" element={<Festivals />} />
                <Route path="/festivals/package" element={< Packages />} />
                <Route path="/spotify/callback" element={<SpotifyCallback />} />
                <Route path="/preferences" element={<Preferences />} />
                <Route path="/checkout" element={< Checkout />} />
              </Routes>
            </BrowserRouter>
          </div>
        </AppContext.Provider>
      </FestivalProvider>

    </ThemeProvider>

  );
}

export interface User {
  _id: string;
  username: string;
  generes: string[];
  email: string;
}

export interface FestivalInterface {
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  website: string;
  locationCode: string;
  cityCode: string;
}

export interface PackageInterface {
  _id: string;
  price: string;
  festivalId: string;
  startDay: string;
  endDay: string;
  flights: {
    departure: FlightInterface[];
    return: FlightInterface[];
  };
  accommodation: string;
  packageType: PackageEnum;
  checkedBags: number;
  class: string;
  hotelRaating?: number;
  hotelId: string
}

export interface FlightInterface {
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  airline: string;
}

export enum PackageEnum {
  LITE = "LITE",
  STANDARD = "STANDARD",
  PREMIUM = "PREMIUM"
}

export interface AmadeusFlightOffer {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Itinerary[];
  price: Price;
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
  packageType: PackageEnum;
}

export interface Itinerary {
  duration: string;
  segments: Segment[];
}
export interface Segment {
  departure: Departure;
  arrival: Arrival;
  carrierCode: string;
  number: string;
  aircraft: Aircraft;
  operating: Operating;
}
export interface Departure {
  iataCode: string;
  terminal: string;
  at: string;
}

export interface Arrival {
  iataCode: string;
  terminal: string;
  at: string;
}

export interface Aircraft {
  code: string;
}

export interface Operating {
  carrierCode: string;
}

export interface Price {
  currency: string;
  total: string;
  base: string;
  fees: Fee[];
  grandTotal: string;
}
export interface Fee {
  amount: string;
}

export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  price: Price;
  fareDetailsBySegment: FareDetailsBySegment[];
}

export interface FareDetailsBySegment {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  brandedFare: string;
  class: string;
  includedCheckedBags: IncludedCheckedBags;
}

export interface IncludedCheckedBags {
  quantity: number;
}


export const AppContext = createContext<AppContextProps>({});

interface AppContextProps {
  festivals?: FestivalInterface[];
  setFestivals?: (festivals: FestivalInterface[]) => void;
  user?: User;
  setUser?: (user: User) => void;
  packages?: PackageInterface[];
  setPackages?: (packages: PackageInterface[]) => void;
  selectedPackage?: PackageInterface;
  setSelectedPackage?: (selectedPackage: PackageInterface) => void;
}