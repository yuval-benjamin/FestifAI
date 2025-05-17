import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    ReactNode,
} from "react";
import axios from "axios";
import { FestivalInterface } from "../App";

type FestivalContextType = {
    festivals: FestivalInterface[];
    currentFestivals: FestivalInterface[];
    page: number;
    lowPrice: number;
    highPrice: number;
    isLoading: boolean;
    error: string | null;
    setLowPrice: (n: number) => void;
    setHighPrice: (n: number) => void;
    fetchFestivals: () => void;
};

export const FestivalContext = createContext<FestivalContextType | undefined>(undefined);

export const FestivalProvider = ({ children }: { children: ReactNode }) => {
    const [festivals, setFestivals] = useState<FestivalInterface[]>([]);
    const [page, setPage] = useState(0);
    const [lowPrice, setLowPrice] = useState(0);
    const [highPrice, setHighPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentFestivals = useMemo(() => {
        return festivals.slice((page - 1) * 3, page * 3);
    }, [page, festivals]);

    const fetchFestivals = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get<{ festivals: FestivalInterface[] }>(
                `http://localhost:3000/festivals`,
                {
                    params: { lowPrice, highPrice, page },
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
                festivals,
                currentFestivals,
                page,
                lowPrice,
                highPrice,
                isLoading,
                error,
                setLowPrice,
                setHighPrice,
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

