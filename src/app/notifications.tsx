import Header from '@/src/components/Header'
import { ScreenContainer } from '@/src/components/ScreenContainer'
import { Body, Label, Muted } from '@/src/components/Typography'
import { COLORS } from '@/src/constants/styles'
import { auth } from '@/src/services/firebase.service'
import { markNotificationsAsRead, subscribeToNotifications } from '@/src/services/notification.service'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, RefreshControl, SectionList, TouchableOpacity, View } from 'react-native'

// Simple time formatter if date-fns not installed
const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

const groupNotificationsByDate = (notifications: any[]) => {
    const groups: { [key: string]: any[] } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    notifications.forEach(notif => {
        const date = notif.createdAt?.toDate();
        if (!date) return;

        let title = "Earlier";
        const compareDate = new Date(date);
        compareDate.setHours(0, 0, 0, 0);

        if (compareDate.getTime() === today.getTime()) {
            title = "Today";
        } else if (compareDate.getTime() === yesterday.getTime()) {
            title = "Yesterday";
        } else {
            title = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        if (!groups[title]) {
            groups[title] = [];
        }
        groups[title].push(notif);
    });

    return Object.keys(groups).sort((a, b) => {
        if (a === "Today") return -1;
        if (b === "Today") return 1;
        if (a === "Yesterday") return -1;
        if (b === "Yesterday") return 1;
        return 0; // Simple sort for now
    }).map(title => ({
        title,
        data: groups[title]
    }));
};

export default function Notifications() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!auth.currentUser) return;

        const unsubscribe = subscribeToNotifications(auth.currentUser.uid, (data) => {
            setNotifications(data);
            setLoading(false);

            // Mark unread as read
            const unreadIds = data.filter(n => !n.read).map(n => n.id);
            if (unreadIds.length > 0) {
                markNotificationsAsRead(unreadIds).catch(e => console.error("Error marking read:", e));
            }
        });

        return () => unsubscribe();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    const groupedNotifications = groupNotificationsByDate(notifications);

    return (
        <ScreenContainer style={{ backgroundColor: COLORS.PRIMARY }}>
            <View className="flex-1 pt-4">
                <Header title='Notifications'>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="close" size={28} color={COLORS.TEXT_PRIMARY} />
                    </TouchableOpacity>
                </Header>

                {loading ? (
                    <ActivityIndicator color={COLORS.ACCENT} className="mt-10" />
                ) : notifications.length === 0 ? (
                    <Muted className="text-center mt-10">No notifications yet.</Muted>
                ) : (
                    <SectionList
                        sections={groupedNotifications}
                        keyExtractor={item => item.id}
                        stickySectionHeadersEnabled={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.ACCENT} />
                        }
                        renderSectionHeader={({ section: { title } }) => (
                            <Label className="mt-6 mb-3 px-1">{title}</Label>
                        )}
                        renderItem={({ item }) => (
                            <View
                                className={`mb-3 p-4 rounded-2xl border ${!item.read ? 'border-l-4 border-l-red-400' : ''}`}
                                style={{
                                    backgroundColor: COLORS.SURFACE,
                                    borderColor: COLORS.BORDER
                                }}
                            >
                                <Body className={`${!item.read ? 'font-bold' : 'font-medium'}`}>{item.message}</Body>
                                <Muted className="text-xs mt-2">{formatTime(item.createdAt)}</Muted>
                            </View>
                        )}
                        contentContainerStyle={{ paddingBottom: 40 }}
                    />
                )}
            </View>
        </ScreenContainer>
    )
}

