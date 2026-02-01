import CustomModal from '@/src/components/CustomModal'
import Header from '@/src/components/Header'
import Post from '@/src/components/Post'
import { ScreenContainer } from '@/src/components/ScreenContainer'
import SkeletonPost from '@/src/components/SkeletonPost'
import { Muted } from '@/src/components/Typography'
import { COLORS } from '@/src/constants/styles'
import { auth } from '@/src/services/firebase.service'
import { deletePost, subscribeToUserPosts } from '@/src/services/post.service'
import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'

export default function Profile() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    useEffect(() => {
        if (!auth.currentUser) return;
        return subscribeToUserPosts(auth.currentUser.uid, (postsData) => {
            setPosts(postsData);
            setLoading(false);
        });
    }, []);

    const handleDeletePost = (postId: string) => {
        setSelectedPostId(postId);
        setDeleteModalVisible(true);
    };

    const confirmDeletePost = async () => {
        if (!selectedPostId) return;
        setDeleteModalVisible(false);
        try {
            await deletePost(selectedPostId);
        } catch (error) {
            console.error("Delete failed", error);
        } finally {
            setSelectedPostId(null);
        }
    };

    return (
        <ScreenContainer style={{ backgroundColor: COLORS.BACKGROUND }}>
            <CustomModal
                visible={deleteModalVisible}
                title="Delete Post"
                message="Are you sure you want to delete this post?"
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                onCancel={() => setDeleteModalVisible(false)}
                onConfirm={confirmDeletePost}
            />

            <View className="flex-1 pt-4">
                <Header title='My Feelings'>
                    <Link href="/settings" asChild>
                        <TouchableOpacity className="p-2 rounded-full bg-black/5">
                            <Ionicons name="settings-outline" size={24} color={COLORS.TEXT_PRIMARY} />
                        </TouchableOpacity>
                    </Link>
                </Header>

                <Muted className="mb-6 text-xs">
                    These posts are only visible to you (and anonymously on feed)
                </Muted>

                {loading ? (
                    <View className="flex-1 pt-4">
                        <SkeletonPost />
                        <SkeletonPost />
                    </View>
                ) : posts.length === 0 ? (
                    <View className="flex-1 justify-center items-center mt-10">
                        <Muted>You haven't posted anything yet.</Muted>
                    </View>
                ) : (
                    <FlatList
                        data={posts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <Post
                                post={item}
                                onDelete={() => handleDeletePost(item.id)}
                            />
                        )}
                        contentContainerStyle={{
                            gap: 16,
                            paddingBottom: 20
                        }}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </ScreenContainer>
    )
}