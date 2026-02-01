import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.service";

export async function signInAnonymous() {
    try {
        const result = await signInAnonymously(auth);
        return result.user;
    } catch (error) {
        console.error("Anonymous sign-in failed:", error);
        throw error;
    }
}

export function listenToAuthState(callback: any) {
    return onAuthStateChanged(auth, (user) => {
        callback(user);
    });
}
