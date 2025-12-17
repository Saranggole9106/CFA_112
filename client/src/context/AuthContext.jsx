import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await fetch('/api/auth/me', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const userData = await res.json();
                        setUser({ ...userData, token });
                    } else {
                        localStorage.removeItem('token');
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Auth verification failed', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    // Login function - can accept either:
    // 1. (email, password) - makes API call
    // 2. (responseData) - uses response directly (for when page already made the call)
    const login = async (emailOrData, password) => {
        try {
            // If second parameter exists, it's email/password login
            if (password !== undefined) {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailOrData, password })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);

                localStorage.setItem('token', data.token);
                setUser({ ...data.user, token: data.token });
                return { success: true, user: data.user };
            } else {
                // It's direct response data with token and user
                const data = emailOrData;
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    const userData = data.user || data;
                    setUser({ ...userData, token: data.token });
                    return { success: true };
                }
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const register = async (username, email, password, role) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, role })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            localStorage.setItem('token', data.token);
            setUser({ ...data.user, token: data.token });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('hasSeenSplash');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
