import Header from '@/src/components/Header';
import Post from '@/src/components/Post';
import { ScreenContainer } from '@/src/components/ScreenContainer';
import SkeletonPost from '@/src/components/SkeletonPost';
import { COLORS } from '@/src/constants/styles';
import { auth } from '@/src/services/firebase.service';
import { subscribeToUnreadCount } from '@/src/services/notification.service';
import { subscribeToAllPosts } from '@/src/services/post.service';
import { Ionicons } from "@expo/vector-icons";
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    console.log("Home: Rendering. posts count:", posts.length, "loading:", loading);

    // Unread count listener
    useEffect(() => {
        if (!auth.currentUser) return;
        return subscribeToUnreadCount(auth.currentUser.uid, setUnreadCount);
    }, []);

    useEffect(() => {
        return subscribeToAllPosts((postsData) => {
            setPosts(postsData);
            setLoading(false);
        });
    }, []);

    return (
        <ScreenContainer style={{ backgroundColor: COLORS.PRIMARY, flex: 1 }}>
            <View style={{ flex: 1 }} className="flex-1 pt-4">
                <Header title='Your Feed'>
                    <View className='flex flex-row gap-5 items-center'>
                        <Link href={'/create'}>
                            <Ionicons name='add-circle-outline' size={32} color={COLORS.ACCENT} />
                        </Link>
                        <Link href={'/notifications'} asChild>
                            <TouchableOpacity className="relative p-1">
                                <Ionicons name='notifications-outline' size={32} color={COLORS.TEXT_MUTED} />
                                {unreadCount > 0 && (
                                    <View
                                        className="absolute top-0 right-0 bg-red-500 rounded-full w-4 h-4 justify-center items-center"
                                    >
                                        <Text className="text-white text-[12px] font-bold">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </Link>
                    </View>
                </Header>

                {loading ? (
                    <View className="flex-1 pt-4">
                        <SkeletonPost />
                        <SkeletonPost />
                        <SkeletonPost />
                    </View>
                ) : (
                    <FlatList
                        data={posts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <Post post={item} />}
                        contentContainerStyle={{
                            paddingVertical: 10,
                            gap: 16,
                            paddingBottom: 100
                        }}
                        showsVerticalScrollIndicator={false}
                        bounces={true}
                    />
                )}
            </View>
        </ScreenContainer>
    )
}