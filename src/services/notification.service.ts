import { db } from "@/src/services/firebase.service";
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Device from 'expo-device';
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    where,
    writeBatch
} from "firebase/firestore";
import { Platform } from 'react-native';

// Notifications will be required dynamically inside the registration function
// to prevent crashes in environments where the module is internally unsupported (like Expo Go)
let Notifications: any = null;
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

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

export const registerForPushNotificationsAsync = async () => {
    try {
        // Only attempt to require when we are NOT in Expo Go
        if (isExpoGo) {
            console.log('Push notifications are not supported in Expo Go.');
            return null;
        }

        if (!Notifications) {
            try {
                Notifications = require('expo-notifications');
            } catch (e) {
                console.warn('expo-notifications module could not be loaded');
                return null;
            }
        }

        if (!Device.isDevice) {
            console.log('Notification Service: Must use physical device for Push Notifications');
            return null;
        }

        const { status: referralStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = referralStatus;
        if (referralStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return null;
        }

        const token = (await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas?.projectId || '8295a24b-4353-48c9-949c-9dd189464b00'
        })).data;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
    } catch (error) {
        console.warn('Error registering for push notifications:', error);
        return null;
    }
};

export const sendPushNotification = async (expoPushToken: string, title: string, body: string, data?: any) => {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: title,
        body: body,
        data: data || {},
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
};
