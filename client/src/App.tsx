import './App.css'
import HomePage from './components/homepage'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import React, { createContext, ReactNode, useState } from 'react';
import { Festivals } from './components/Festivals/Festivals';
import { Packages } from './components/Packages/Packages';
import { Preferences } from './components/Preferences';
import SpotifyCallback from "./pages/spotifyCallback";

export function App() {
  const [user, setUser] = useState<User>();
  const [festivals, setFestivals] = useState<FestivalInterface[]>([]);

  return (
    <AppContext.Provider
      value={{
        setFestivals,
        festivals,
        user,
        setUser,
      }}>
      <div className="container-inline d-flex flex-column justify-content-center align-items-center text-white opacity-75"
        style={{ height: "100vh", backgroundImage: "url(/festival-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/festivals" element={<Festivals />} />
            <Route path="/festivals/package" element={< Packages/>} />
            <Route path="/spotify/callback" element={<SpotifyCallback />} />
            <Route path="/preferences" element={<Preferences />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AppContext.Provider>
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
}

export interface PackageInterface {
  _id: string;
  price: number;
  festivalId: string;
  startDay: string;
  endDay: string;
  flights: FlightInterface;
  accommodation: string;
  packageType: PackageEnum;
}

export interface FlightInterface {
  _id: string;
  departure: Date;
  arrival: Date;
  airline: string;
}

export enum PackageEnum {
  LITE = "LITE",
  STANDARD = "STANDARD",
  PREMIUM = "PREMIUM"
}

export const AppContext = createContext<AppContextProps>({});

interface AppContextProps {
  festivals?: FestivalInterface[];
  setFestivals?: (festivals: FestivalInterface[]) => void;
  user?: User;
  setUser?: (user: User) => void;
}