import { Button } from "@/src/components/Button";
import CustomModal from "@/src/components/CustomModal";
import { Input } from "@/src/components/Input";
import { Pill } from "@/src/components/Pill";
import { ScreenContainer } from "@/src/components/ScreenContainer";
import { Heading, Label } from "@/src/components/Typography";
import { auth } from "@/src/services/firebase.service";
import { createPost } from "@/src/services/post.service";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";

export default function CreatePost() {
    const [mood, setMood] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    const showAlert = (title: string, message: string) => {
        setModalTitle(title);
        setModalMessage(message);
        setModalVisible(true);
    };

    const handlePost = async () => {
        if (!content.trim()) {
            showAlert("Missing Content", "Please write something to post.");
            return;
        }

        if (!auth.currentUser) {
            showAlert("Authentication Error", "You must be logged in to post.");
            return;
        }

        setIsSubmitting(true);
        try {
            await createPost({
                content: content.trim(),
                mood: mood.trim(),
                userId: auth.currentUser.uid,
            });

            setMood("");
            setContent("");
            router.back();
        } catch (error) {
            console.error("Error creating post:", error);
            showAlert("Error", "Failed to create post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScreenContainer className="flex-1 p-6">
            <CustomModal
                visible={modalVisible}
                title={modalTitle}
                message={modalMessage}
                onCancel={() => setModalVisible(false)}
                confirmText="OK"
            />

            <View className="py-4">
                <Heading>Create Post</Heading>
            </View>

            {/* Form */}
            <View className="flex-1 pt-6 gap-6">
                {/* Mood Selection */}
                <View>
                    <Label>How are you feeling?</Label>
                    <View className="flex-row flex-wrap gap-2">
                        {["Anxious", "Lonely", "Grateful", "Sad", "Happy", "Stressed", "Hopeful", "Tired", "Excited", "Numb"].map((option) => (
                            <Pill
                                key={option}
                                label={option}
                                isSelected={mood === option}
                                onPress={() => setMood(mood === option ? "" : option)}
                            />
                        ))}
                    </View>
                </View>

                {/* Content Input */}
                <Input
                    label="What's on your mind?"
                    value={content}
                    onChangeText={setContent}
                    placeholder="Write freely. No one is judging."
                    multiline
                />

                {/* Submit Button */}
                <Button
                    label="Post"
                    onPress={handlePost}
                    isLoading={isSubmitting}
                />
            </View>
        </ScreenContainer>
    );
}

