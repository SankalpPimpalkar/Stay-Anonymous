import { db } from "@/src/services/firebase.service";
import { deleteUser as firebaseDeleteUser, User } from "firebase/auth";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    where,
    writeBatch
} from "firebase/firestore";

export const deleteUserAccount = async (user: User) => {
    const batch = writeBatch(db);

    // 1. Delete all user posts
    const postsQuery = query(collection(db, "posts"), where("userId", "==", user.uid));
    const postsSnapshot = await getDocs(postsQuery);
    postsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });

    // 2. Delete user notifications
    const notifsQuery = query(collection(db, "notifications"), where("userId", "==", user.uid));
    const notifsSnapshot = await getDocs(notifsQuery);
    notifsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });

    // 3. Delete user document
    batch.delete(doc(db, "users", user.uid));

    // Commit Firestore deletions
    await batch.commit();

    // 4. Delete user auth
    return await firebaseDeleteUser(user);
};

export const updateUserPushToken = async (userId: string, token: string) => {
    return await setDoc(doc(db, "users", userId), {
        pushToken: token,
        updatedAt: new Date()
    }, { merge: true });
};

export const getUserPushToken = async (userId: string) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.exists() ? userDoc.data().pushToken : null;
};
