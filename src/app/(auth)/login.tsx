import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from '@/src/constants/styles'
import { useAuth } from '@/src/context/AuthContextProvider'
import { Redirect } from 'expo-router'

export default function LoginScreen() {

    const { signInAnonymously, isAuthenticated } = useAuth()

    if (isAuthenticated) {
        return <Redirect href={'/(tabs)/home'} />
    }

    return (
        <SafeAreaView style={{ backgroundColor: COLORS.PRIMARY }} className="flex-1">
            <View className="flex-1 justify-end px-6 pb-4">
                <View className="gap-12">
                    <View className="gap-4">
                        <Text style={{ color: COLORS.ACCENT }} className="text-sm uppercase font-bold tracking-widest">
                            Anonymous Feelings
                        </Text>

                        <Text className="text-white text-6xl font-extrabold leading-tight">
                            Say what you{"\n"}can't say{" "}
                            <Text style={{ color: COLORS.ACCENT }}>out loud</Text>
                        </Text>

                        <Text className="text-gray-400 text-base leading-relaxed max-w-[90vw]">
                            Express your feelings freely. No names, no profiles — just honesty.
                        </Text>
                    </View>

                    <View className="gap-3">
                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={{ backgroundColor: COLORS.ACCENT }}
                            className="bg-white py-4 rounded-xl"
                            onPress={signInAnonymously}
                        >
                            <Text style={{ color: COLORS.TEXT_PRIMARY }} className="text-center text-lg font-extrabold text-black">
                                Join Anonymously
                            </Text>
                        </TouchableOpacity>

                        <Text style={{ color: COLORS.TEXT_MUTED }} className="text-xs text-center">
                            No signup. No history. No pressure.
                        </Text>
                    </View>

                </View>
            </View>
        </SafeAreaView>
    )
}