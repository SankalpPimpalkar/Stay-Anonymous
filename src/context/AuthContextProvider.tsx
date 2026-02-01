import { router } from "expo-router";
import { User, signInAnonymously as firebaseSignInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { auth } from "../services/firebase.service";
import { registerForPushNotificationsAsync } from "../services/notification.service";
import { updateUserPushToken } from "../services/user.service";

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
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                setUser(firebaseUser || null);
                setLoading(false);

                if (firebaseUser) {
                    const token = await registerForPushNotificationsAsync();
                    if (token) {
                        await updateUserPushToken(firebaseUser.uid, token);
                    }
                }
            } catch (error) {
                console.error("AuthContextProvider: Error in auth state change listener:", error);
                setLoading(false);
            }
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
