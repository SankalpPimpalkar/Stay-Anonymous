import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
    useCallback,
} from "react";
import { User, onAuthStateChanged, signInAnonymously as firebaseSignInAnonymously } from "firebase/auth";
import { auth } from "../services/firebase.service";
import { router } from "expo-router";

interface AuthContextType {
    user: User | null;
    uid: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    signInAnonymously: () => void;
    deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthContextProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInAnonymously = useCallback(async () => {
        try {
            const result = await firebaseSignInAnonymously(auth);
            setUser(result.user);
            console.log("RESULT", result)
            router.replace('/(tabs)/home')
        } catch (error) {
            console.error("Anonymous sign-in failed:", error);
            return null;
        }
    }, []);

    const deleteAccount = useCallback(async (): Promise<void> => {
        if (!user) return;
        try {
            await user.delete();
            setUser(null);
        } catch (error: any) {
            console.error("Failed to delete user:", error);

            if (error.code === "auth/requires-recent-login") {
                console.warn("Re-authentication required before deletion.");
            }
        }
    }, [user]);

    const value: AuthContextType = {
        user,
        uid: user?.uid ?? null,
        isAuthenticated: !!user,
        loading,
        signInAnonymously,
        deleteAccount,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthContextProvider");
    return context;
};
