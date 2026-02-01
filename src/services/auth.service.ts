import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from "./firebase.service";

export async function signInAnonymous() {
    try {
        const result = await signInAnonymously(auth);
        return result.user;
    } catch (error: any) {
        console.error("AuthService: Anonymous sign-in failed:", error?.message || error);
        throw error;
    }
}

export function listenToAuthState(callback: any) {
    return onAuthStateChanged(auth, (user) => {
        callback(user);
    });
}
