"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/AuthContext";
import { exchangeCodeForToken } from "../auth/pkce";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function CallbackPage() {
    const router = useRouter();
    const { setUserFromToken } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const error = params.get("error");

        if (error) {
            toast.error("Login cancelled.");
            router.replace("/login");
            return;
        }

        if (!code) {
            router.replace("/login");
            return;
        }

        exchangeCodeForToken(code)
            .then(data => {
                localStorage.setItem("token", data.access_token);
                sessionStorage.removeItem("pkce_verifier");
                return api.get("/auth/me");
            })
            .then(res => {
                setUserFromToken({ username: res.data.username, role: res.data.role });
                if (res.data.role === "ADMIN") {
                    router.replace("/admin");
                } else {
                    router.replace("/user");
                }
            })
            .catch(() => {
                toast.error("Login failed. Please try again.");
                router.replace("/login");
            });
    }, []);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <p>Logging in...</p>
        </div>
    );
}
