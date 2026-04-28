"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState } from '../types/auth';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

interface AuthContextType extends AuthState {
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (data: any) => {
        const res = await api.post('/auth/login', data);
        setUser(res.data.user);
        router.push('/dashboard');
    };

    const register = async (data: any) => {
        const res = await api.post('/auth/register', data);
        setUser(res.data.user);
        router.push('/dashboard');
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout API call failed, clearing local state anyway');
        } finally {
            setUser(null);
            router.push('/auth/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
