// src/context/LoadingContext.jsx
import React, { createContext, useState, useContext } from 'react';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingCount, setLoadingCount] = useState(0);

    const showLoading = () => {
        setLoadingCount(prevCount => {
            if (prevCount === 0) setIsLoading(true);
            return prevCount + 1;
        });
    };

    const hideLoading = () => {
        setLoadingCount(prevCount => {
            if (prevCount === 1) setIsLoading(false);
            return Math.max(0, prevCount - 1);
        });
    };

    const value = { isLoading, showLoading, hideLoading };

    return (
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    );
};