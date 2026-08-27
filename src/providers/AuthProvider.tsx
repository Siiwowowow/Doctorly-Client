//src/providers/AuthProvider.tsx
"use client";

import { createContext, useContext, useState } from "react";
import { logoutUser } from "@/services/auth.services";
import { ICurrentUser } from "@/types/user.types";

interface AuthContextType {
    user: ICurrentUser | null;
    setUser: (user: ICurrentUser | null) => void;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ 
    children, 
    initialUser 
}: { 
    children: React.ReactNode; 
    initialUser: ICurrentUser | null; // ✅ type fixed
}) {
    const [user, setUser] = useState<ICurrentUser | null>(initialUser);

    const logout = async () => {
        setUser(null);
        await logoutUser();
        window.location.href = "/login";
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, setUser, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};