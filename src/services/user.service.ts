import { db } from "@/src/services/firebase.service";
import { deleteUser as firebaseDeleteUser, User } from "firebase/auth";
import {
    collection,
    getDocs,
    query,
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

    // Commit Firestore deletions
    await batch.commit();

    // 3. Delete user auth
    return await firebaseDeleteUser(user);
};
