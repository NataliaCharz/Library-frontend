"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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

    const login = async (credentials) => {
        try {
            const res = await api.post("/auth/login", credentials);
            localStorage.setItem("token", res.data.token);
            const userData = { username: res.data.username, role: res.data.role };
            setUser(userData);
            if (res.data.role === "ADMIN") {
                router.push("/admin");
            } else {
                router.push("/user");
            }
        } catch (err) {
            console.error("Login failed", err);
            throw err;
        }
    };

    const register = async (credentials) => {
        try {
            const res = await api.post("/auth/register", credentials);
            localStorage.setItem("token", res.data.token);
            const userData = { username: res.data.username, role: res.data.role };
            setUser(userData);
            toast.success("Registered successfully.");
            if (res.data.role === "ADMIN") {
                router.push("/admin");
            } else {
                router.push("/user");
            }
        } catch (err) {
            console.error("Register failed", err);
            throw err;
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch {
            // ignore
        }
        localStorage.removeItem("token");
        setUser(null);
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
