import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { COLORS } from '../constants/styles';

export default function SkeletonPost() {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    return (
        <View
            className="rounded-2xl p-5 gap-4 mb-4"
            style={{
                backgroundColor: COLORS.SURFACE,
                borderColor: COLORS.BORDER,
                borderWidth: 1,
            }}
        >
            {/* Mood Pill Skeleton */}
            <Animated.View
                style={{
                    opacity,
                    backgroundColor: COLORS.BORDER,
                    width: 80,
                    height: 24,
                    borderRadius: 12
                }}
            />

            {/* Content Skeleton Lines */}
            <View className="gap-2">
                <Animated.View
                    style={{
                        opacity,
                        backgroundColor: COLORS.BORDER,
                        width: '100%',
                        height: 20,
                        borderRadius: 4
                    }}
                />
                <Animated.View
                    style={{
                        opacity,
                        backgroundColor: COLORS.BORDER,
                        width: '80%',
                        height: 20,
                        borderRadius: 4
                    }}
                />
            </View>

            {/* Actions Skeleton */}
            <View className="flex-row gap-3 pt-2">
                <Animated.View
                    style={{
                        opacity,
                        backgroundColor: COLORS.BORDER,
                        width: 100,
                        height: 36,
                        borderRadius: 18
                    }}
                />
                <Animated.View
                    style={{
                        opacity,
                        backgroundColor: COLORS.BORDER,
                        width: 100,
                        height: 36,
                        borderRadius: 18
                    }}
                />
            </View>
        </View>
    )
}
