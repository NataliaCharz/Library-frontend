"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { generateCodeVerifier, generateCodeChallenge, buildAuthUrl, buildRegisterUrl, buildLogoutUrl } from "./pkce";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }
        api.get("/auth/me")
            .then(res => setUser({ username: res.data.username, role: res.data.role }))
            .catch(() => {
                localStorage.removeItem("token");
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async () => {
        const verifier = generateCodeVerifier();
        const challenge = await generateCodeChallenge(verifier);
        sessionStorage.setItem("pkce_verifier", verifier);
        window.location.href = buildAuthUrl(challenge);
    };

    const register = async () => {
        const verifier = generateCodeVerifier();
        const challenge = await generateCodeChallenge(verifier);
        sessionStorage.setItem("pkce_verifier", verifier);
        window.location.href = buildRegisterUrl(challenge);
    };

    const logout = () => {
        const logoutUrl = buildLogoutUrl();
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = logoutUrl;
    };

    const setUserFromToken = (userData) => {
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, setUserFromToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
