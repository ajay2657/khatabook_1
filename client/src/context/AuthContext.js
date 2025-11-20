import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Intentionally not loading token from localStorage to force login on every refresh
        // const storedToken = localStorage.getItem('token');
        // if (storedToken) {
        //     setToken(storedToken);
        // }
        setLoading(false);
    }, []);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
