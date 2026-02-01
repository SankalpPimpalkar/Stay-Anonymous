import { Button } from "@/src/components/Button";
import CustomModal from "@/src/components/CustomModal";
import { ScreenContainer } from "@/src/components/ScreenContainer";
import { Heading, Label } from "@/src/components/Typography";
import { COLORS } from "@/src/constants/styles";
import { auth } from "@/src/services/firebase.service";
import { deleteUserAccount } from "@/src/services/user.service";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';

export default function Settings() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handleDeleteAccount = () => {
        setModalVisible(true);
    };

    const confirmDelete = async () => {
        setModalVisible(false);
        try {
            const user = auth.currentUser;
            if (!user) return;

            setLoading(true);
            await deleteUserAccount(user);
            router.replace('/(auth)/login');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer style={{ backgroundColor: COLORS.PRIMARY }}>
            <View className="flex-1 pt-4">
                <CustomModal
                    visible={modalVisible}
                    title="Delete Account"
                    message="This will permanently delete your account and all your posts. This action cannot be undone."
                    confirmText="Delete My Account"
                    cancelText="Cancel"
                    type="danger"
                    onCancel={() => setModalVisible(false)}
                    onConfirm={confirmDelete}
                />

                <View className="flex-row items-center gap-4 mb-6">
                    <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} onPress={() => router.back()} />
                    <Heading>Settings</Heading>
                </View>

                <View className="mt-4">
                    <Label className="mb-4 ml-1">Danger Zone</Label>
                    <Button
                        label="Delete My Account"
                        variant="danger"
                        onPress={handleDeleteAccount}
                        isLoading={loading}
                    />
                </View>
            </View>
        </ScreenContainer>
    )
}

