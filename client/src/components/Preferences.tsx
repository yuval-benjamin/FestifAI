import axios from 'axios';
import React, { useState } from 'react';

const Preferences: React.FC = () => {
    const [lowPrice, setLowPrice] = useState<number | undefined>(undefined);
    const [highPrice, setHighPrice] = useState<number | undefined>(undefined);
    const fetchFestivals = () => {
        axios.get(`/localhost:3000/api/festivals?lowPrice=${lowPrice}&highPrice=${highPrice}`)
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

export default Preferences;