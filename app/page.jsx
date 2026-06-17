"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth/AuthContext";

export default function HomePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace(user.role === "ADMIN" ? "/admin" : "/user");
        }
    }, [user, loading]);

    return (
        <main>
            <div className="admin-home">
                <h1 className="admin-home-header">Library Application</h1>
                <p>Welcome on a page where You can store Your favorite books and get back any time any anywhere You want.</p>
            </div>
        </main>
    );
}
