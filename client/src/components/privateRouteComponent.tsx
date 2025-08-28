
import React, { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SPOTIFY_KEYS } from '../services/spotifyService';

interface PrivateRouteProps {
    element: React.ReactNode;
}

export const PrivateRouteComponent: React.FC<PrivateRouteProps> = ({
    element,
}) => {
    const token = localStorage.getItem(SPOTIFY_KEYS.ACCESS_TOKEN);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token]);

    return <Fragment>{element}</Fragment>;
};