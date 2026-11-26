import { createContext, useState, useEffect } from 'react';
import { request } from '../api/auth.api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    const data = await request('/auth/me');
                    setUser(data);
                } catch {
                    localStorage.removeItem('token');
                }
            }

            setLoading(false);
        }

        loadUser();
    }, []);

    async function login(email, password) {
        const data = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        localStorage.setItem('token', data.token);
        setUser(data.user);

        return data.user;
    }

    async function register(username, email, password) {
        const data = await request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        localStorage.setItem('token', data.token);
        setUser(data.user);

        return data.user;
    }

    async function logout() {
        try {
            await request('/auth/logout', {
                method: 'POST'
            });
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loading,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}