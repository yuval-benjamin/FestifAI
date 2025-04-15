import './App.css'
import HomePage from './components/homepage'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { createContext, ReactNode, useState } from 'react';
import {Festivals} from './components/Festivals/Festivals';
import {Packages} from './components/Packages/Packages';
import SpotifyCallback from "./pages/spotifyCallback";

export function App() {
  const [user, setUser] = useState<User>();


  return (
      <AppContext.Provider
        value={{
          user,
          setUser,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/festivals" element={<Festivals />} />
            <Route path="/festivals/package" element={< Packages/>} />
            <Route path="/spotify/callback" element={<SpotifyCallback />} />
          </Routes>
        </BrowserRouter>
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
      _id: string;
      link: string;
      name: string;
      location: string;
      genre: string;
      price: number;
      startDay: string;
      endDay: string;
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
      LITE="LITE",
      STANDARD="STANDARD",
      PREMIUM="PREMIUM"
  }
  
export const AppContext = createContext<AppContextProps>({});

interface AppContextProps {
  user?: User;
  setUser?: (user: User) => void;
}