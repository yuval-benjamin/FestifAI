import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    ReactNode,
} from "react";
import axios from "axios";
import { FestivalCategory, FestivalInterface } from "../App";
import { useUser } from "../context/UserContext";
import axiosInstance from '../api/axiosInstance'


type FestivalContextType = {
    festivals: FestivalInterface[];
    chosenFestivalCategory?: FestivalCategory;
    setChosenFestivalCategory: (category: FestivalCategory) => void;
    currentFestivals: FestivalInterface[];
    date: string;
    page: number;
    priceArea: number;
    country: string;
    isLoading: boolean;
    error: string | null;
    setCountry: (n: string) => void;
    setPriceArea: (n: number) => void;
    setDate: (n: string) => void;
    fetchFestivals: () => Promise<void>;
};

export const FestivalContext = createContext<FestivalContextType | undefined>(undefined);

export const FestivalProvider = ({ children }: { children: ReactNode }) => {
    const [chosenFestivalCategory, setChosenFestivalCategory] = useState<string>();
    const { email } = useUser();
    const [festivals, setFestivals] = useState<FestivalInterface[]>([]);
    const [page, setPage] = useState(0);
    const [priceArea, setPriceArea] = useState(0);
    const [date, setDate] = useState("");
    const [country, setCountry] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentFestivals = useMemo(() => {
        return festivals.slice((page - 1) * 3, page * 3);
    }, [page, festivals]);

    const fetchFestivals = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get<{ festivals: FestivalInterface[] }>(
                `/festivals`,
                {
                    params: { priceArea, date, location: country, page, email },
                }
            );
            setFestivals((prev) => [...prev, ...response.data.festivals]);
            setPage((prev) => prev + 1);
        } catch (e) {
            setError("Failed to fetch festivals");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FestivalContext.Provider
            value={{
                setDate,
                chosenFestivalCategory,
                setChosenFestivalCategory,
                date,
                festivals,
                currentFestivals,
                page,
                priceArea,
                country,
                isLoading,
                error,
                setPriceArea,
                setCountry,
                fetchFestivals,
            }} >
            {children}
        </FestivalContext.Provider>
    );
};

export const useFestivals = () => {
    const context = useContext(FestivalContext);
    if (!context) {
        throw new Error("useFestivals must be used within a FestivalProvider");
    }
    return context;
};

