"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
    const { login, user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace(user.role === "ADMIN" ? "/admin" : "/user");
        }
    }, [user, loading]);

    return (
        <div>
            <h2>Login</h2>
            <p>You will be redirected to the secure login page.</p>
            <button onClick={login}>Log in with Keycloak</button>
        </div>
    );
}
