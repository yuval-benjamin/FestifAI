import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FestivalInterface, useStore } from '../App';
import { useQuery } from '@tanstack/react-query';
import apiService from '../api';

export const Preferences: React.FC = () => {
    const { highPrice, setHighPrice, lowPrice, setLowPrice } = useStore();

    const { isLoading, refetch, data } = useQuery({
        queryKey: ["festivals"],
        enabled: false,
        queryFn:
            async () =>
                await apiService.get<{ festivals: FestivalInterface[] }>(`/festivals?lowPrice=${lowPrice}&highPrice=${highPrice}`)
    })

    const navigate = useNavigate();
    const fetchFestivals = async () => {
        refetch().then(() => {
            navigate("/festivals");
        })
    };

    return (
        <div className="container mt-4">
            <div className="form-group">
                <label htmlFor="lowPrice">Low Price</label>
                <input
                    value={lowPrice}
                    onChange={(e) => setLowPrice(Number(e.target.value))}
                    type="number"
                    className="form-control"
                    id="lowPrice"
                    placeholder="Enter low price"
                />
            </div>
            <div className="form-group mt-3">
                <label htmlFor="highPrice">High Price</label>
                <input
                    value={highPrice}
                    onChange={(e) => setHighPrice(Number(e.target.value))}
                    type="number"
                    className="form-control"
                    id="highPrice"
                    placeholder="Enter high price"
                />
            </div>
            <button className="btn btn-primary mt-4" onClick={fetchFestivals}>Get Festivals</button>
        </div>
    );
};
