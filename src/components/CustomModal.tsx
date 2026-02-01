import { COLORS } from '@/src/constants/styles';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface CustomModalProps {
    visible: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'info' | 'danger'; // 'danger' makes confirm button red
}

export default function CustomModal({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "OK",
    cancelText = "Cancel",
    type = 'info'
}: CustomModalProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                <View
                    className="w-full rounded-2xl p-6"
                    style={{
                        backgroundColor: COLORS.SURFACE,
                        borderColor: COLORS.BORDER,
                        borderWidth: 1,
                        // Shadow for elegance
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4.65,
                        elevation: 8,
                    }}
                >
                    <Text className="text-xl font-bold mb-2 text-center" style={{ color: COLORS.TEXT_PRIMARY }}>
                        {title}
                    </Text>
                    <Text className="text-base mb-6 text-center leading-5" style={{ color: COLORS.TEXT_SECONDARY }}>
                        {message}
                    </Text>

                    <View className="flex-row gap-3">
                        {onConfirm ? (
                            <>
                                <TouchableOpacity
                                    className="flex-1 py-3 rounded-xl border items-center"
                                    style={{ borderColor: COLORS.BORDER, backgroundColor: 'transparent' }}
                                    onPress={onCancel}
                                >
                                    <Text className="font-semibold" style={{ color: COLORS.TEXT_SECONDARY }}>
                                        {cancelText}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-1 py-3 rounded-xl items-center"
                                    style={{ backgroundColor: type === 'danger' ? COLORS.ERROR : COLORS.ACCENT }}
                                    onPress={onConfirm}
                                >
                                    <Text className="font-semibold text-white">
                                        {confirmText}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity
                                className="flex-1 py-3 rounded-xl items-center"
                                style={{ backgroundColor: COLORS.BUTTON_PRIMARY }}
                                onPress={onCancel} // Single button acts as Close/OK
                            >
                                <Text className="font-semibold" style={{ color: COLORS.BUTTON_PRIMARY_TEXT }}>
                                    {confirmText}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}
