//src/providers/AuthProvider.tsx
"use client";

import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
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
    initialUser: ICurrentUser | null;
}) {
    const [user, setUser] = useState<ICurrentUser | null>(initialUser);

    useEffect(() => {
        setUser(initialUser);
    }, [initialUser]);

    const logout = useCallback(async () => {
        setUser(null);
        await logoutUser();
        window.location.href = "/login";
    }, []);

    const isAuthenticated = !!user;

    const value = useMemo(
        () => ({ user, setUser, logout, isAuthenticated }),
        [user, logout, isAuthenticated]
    );

    return (
        <AuthContext.Provider value={value}>
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
