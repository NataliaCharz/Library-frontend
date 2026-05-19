"use client";
import "./globals.scss";
import {AuthProvider, useAuth} from "./auth/AuthContext";
import Link from "next/link";
import RequireAuth from "./auth/RequireAuth";
import { Toaster } from 'react-hot-toast';
import {useEffect, useState} from "react";

export default function RootLayout({children}) {
    return (
            <html lang="en">
            <body>
            <AuthProvider>
                <LayoutWrapper>{children}</LayoutWrapper>
                <Toaster position="top-right" reverseOrder={false} />
            </AuthProvider>
            </body>
            </html>
    );
}

function LayoutWrapper({children}) {
    const {user, loading} = useAuth();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!user) return;

        const eventSource = new EventSource("/api/notifications", {
            withCredentials: true,
        });

        eventSource.onmessage = (e) => {
            setNotifications((prev) => [...prev, e.data]);
        };

        eventSource.onerror = () => eventSource.close();

        return () => eventSource.close();
    }, [user]);

    const removeNotification = (index) => {
        setNotifications((prev) => prev.filter((_, i) => i !== index));
    };

    if (loading) return <p>Loading...</p>;

    if (!user) {
        return (
            <div className="root-layout">
                <aside className="panel">
                    <h2>Welcome Guest</h2>
                    <nav>
                        <Link href="/login">Login</Link>
                        <Link href="/register">Register</Link>
                        <Link href="/library">Explore Library</Link>
                    </nav>
                </aside>
                <main className="panel-content">{children}</main>
            </div>
        );
    }

    if (user.role === "ADMIN") {
        return (
            <RequireAuth allowedRoles={["ADMIN"]}>
                <div className="root-layout">
                    <aside className="panel">
                        <h2>Admin Panel</h2>
                        <nav>
                            <Link href="/admin">Home</Link>
                            <Link href="/admin/addAuthor">Add Authors</Link>
                            <Link href="/admin/addBook">Add Books</Link>
                            <Link href="/books">All Books</Link>
                            <Link href="/authors">All Authors</Link>
                            <Link href="/admin/messages">Contact Messages</Link>
                            <Link href="/logout">Logout</Link>
                        </nav>
                    </aside>
                    <main className="panel-content">{children}</main>
                </div>
                <div className="notifications">
                    {notifications.map((msg, i) => (
                        <div key={i} className="notification">
                            {msg}
                            <button className="close-btn" onClick={() => removeNotification(i)}>
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </RequireAuth>
        );
    }

    return (
        <RequireAuth allowedRoles={["USER"]}>
            <div className="root-layout">
                <aside className="panel">
                    <h2>Library of {user.username}</h2>
                    <nav>
                        <Link href="/user">Home</Link>
                        <Link href="/user/list">Your List</Link>
                        <Link href="/user/wishlist">Wishlist</Link>
                        <Link href="/authors">Explore Authors</Link>
                        <Link href="/books">Explore Books</Link>
                        <Link href="/library">Explore Library</Link>
                        <Link href="/user/contact">Contact</Link>
                        <Link href="/logout">Logout</Link>
                    </nav>
                </aside>
                <main className="panel-content">{children}</main>
                <div className="notifications">
                    {notifications.map((msg, i) => (
                        <div key={i} className="notification">
                            {msg}
                            <button className="close-btn" onClick={() => removeNotification(i)}>
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </RequireAuth>
    );
}




