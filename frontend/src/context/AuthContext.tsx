import { createContext, useContext, useEffect, useState } from "react";

interface User {
    name: string;
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({children}: {children: React.ReactNode}) => {

    const storedUser = localStorage.getItem('user');
    const initialUser = storedUser ? JSON.parse(storedUser) : null;

    const [user, setUser] = useState<User | null>(initialUser);

    useEffect(() => {
        if(user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user')
        }
    }, [user])

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if(context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider !!")
    }

    return context;
}