"use client";

import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
    const { login } = useAuth();

    return (
        <div>
            <h2>Login</h2>
            <p>You will be redirected to the secure login page.</p>
            <button onClick={login}>Log in with Keycloak</button>
        </div>
    );
}
