import { COLORS } from "@/src/constants/styles";
import { auth } from "@/src/services/firebase.service";
import { checkUserReaction, deletePost, handlePostReaction } from "@/src/services/post.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CustomModal from "./CustomModal";

interface PostProps {
    id: string;
    content: string;
    mood: string;
    userId: string;
    createdAt: any;
    reactions: {
        relatable: number;
        support: number;
    };
}

export default function Post({ post, onDelete }: { post: PostProps, onDelete?: () => void }) {
    const [userReaction, setUserReaction] = useState<'relatable' | 'support' | null>(null);

    useEffect(() => {
        if (!auth.currentUser) return;
        checkUserReaction(post.id, auth.currentUser.uid).then(setUserReaction);
    }, [post.id]);

    const handleReaction = async (type: 'relatable' | 'support') => {
        if (!auth.currentUser) return;

        // Optimistic update
        const previousReaction = userReaction;
        setUserReaction(userReaction === type ? null : type);

        try {
            await handlePostReaction(post, auth.currentUser.uid, type);
        } catch (error) {
            console.error("Error updating reaction:", error);
            setUserReaction(previousReaction); // Revert on failure
        }
    };

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const handleDelete = () => {
        if (onDelete) {
            onDelete();
            return;
        }
        setDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        setDeleteModalVisible(false);
        try {
            await deletePost(post.id);
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const isOwner = auth.currentUser?.uid === post.userId;

    const getCount = (type: 'relatable' | 'support') => {
        return post.reactions?.[type] || 0;
    };

    return (
        <View
            className="rounded-2xl p-5 gap-4"
            style={{
                backgroundColor: COLORS.SURFACE,
                borderColor: COLORS.BORDER,
                borderWidth: 1,
            }}
        >
            <View className="flex-row justify-between items-start">
                {/* Mood / Tag */}
                {post.mood ? (
                    <View
                        className="self-start px-3 py-1 rounded-full"
                        style={{ backgroundColor: COLORS.BORDER }}
                    >
                        <Text
                            className="text-xs font-semibold"
                            style={{ color: COLORS.TEXT_SECONDARY }}
                        >
                            {post.mood}
                        </Text>
                    </View>
                ) : <View />}

                {/* Show delete if owner (either via prop or check) */}
                {(isOwner || onDelete) && (
                    <TouchableOpacity onPress={handleDelete} hitSlop={10} className="opacity-60">
                        <Ionicons name="trash-outline" size={20} color={COLORS.TEXT_MUTED} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Main content */}
            <Text
                className="text-lg font-bold leading-snug"
                style={{ color: COLORS.TEXT_PRIMARY }}
            >
                {post.content}
            </Text>

            {/* Actions */}
            <View className="flex-row gap-3 pt-2">
                <TouchableOpacity
                    activeOpacity={0.85}
                    className={`px-4 py-2 rounded-full flex-row items-center gap-2 ${userReaction === 'relatable' ? 'bg-blue-100' : ''}`}
                    style={{
                        backgroundColor: userReaction === 'relatable' ? COLORS.ACCENT + '20' : COLORS.BUTTON_SECONDARY,
                        borderWidth: userReaction === 'relatable' ? 1 : 0,
                        borderColor: COLORS.ACCENT
                    }}
                    onPress={() => handleReaction('relatable')}
                >
                    <Text
                        className="font-semibold"
                        style={{ color: COLORS.ACCENT }}
                    >
                        Relatable
                    </Text>
                    {getCount('relatable') > 0 && (
                        <Text style={{ color: COLORS.ACCENT, fontSize: 12 }}>{getCount('relatable')}</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.85}
                    className={`px-4 py-2 rounded-full flex-row items-center gap-2 ${userReaction === 'support' ? 'bg-purple-100' : ''}`}
                    style={{
                        backgroundColor: userReaction === 'support' ? COLORS.BUTTON_PRIMARY + '20' : COLORS.BUTTON_SECONDARY,
                        borderWidth: userReaction === 'support' ? 1 : 0,
                        borderColor: COLORS.BUTTON_PRIMARY
                    }}
                    onPress={() => handleReaction('support')}
                >
                    <Text
                        className="font-semibold"
                        style={{ color: COLORS.BUTTON_PRIMARY_TEXT }}
                    >
                        I feel you
                    </Text>
                    {getCount('support') > 0 && (
                        <Text style={{ color: COLORS.BUTTON_PRIMARY_TEXT, fontSize: 12 }}>{getCount('support')}</Text>
                    )}
                </TouchableOpacity>
            </View>

            <CustomModal
                visible={deleteModalVisible}
                title="Delete Post"
                message="Are you sure you want to delete this post?"
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                onCancel={() => setDeleteModalVisible(false)}
                onConfirm={confirmDelete}
            />
        </View>
    );
}
