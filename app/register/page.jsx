"use client";

import { useAuth } from "../auth/AuthContext";

export default function RegisterPage() {
    const { register } = useAuth();

    return (
        <div>
            <h2>Register</h2>
            <p>You will be redirected to the secure registration page.</p>
            <button onClick={register}>Register with Keycloak</button>
        </div>
    );
}
