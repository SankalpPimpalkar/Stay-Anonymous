import { db } from "@/src/services/firebase.service";
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    where,
    writeBatch
} from "firebase/firestore";

const NOTIFICATIONS_COLLECTION = "notifications";

export const subscribeToNotifications = (userId: string, callback: (notifications: any[]) => void) => {
    const q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(data);
    });
};

export const subscribeToUnreadCount = (userId: string, callback: (count: number) => void) => {
    const q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where("userId", "==", userId),
        where("read", "==", false)
    );

    return onSnapshot(q, (snapshot) => {
        callback(snapshot.size);
    });
};

export const markNotificationsAsRead = async (notificationIds: string[]) => {
    if (notificationIds.length === 0) return;

    const batch = writeBatch(db);
    notificationIds.forEach(id => {
        const ref = doc(db, NOTIFICATIONS_COLLECTION, id);
        batch.update(ref, { read: true });
    });
    return await batch.commit();
};
