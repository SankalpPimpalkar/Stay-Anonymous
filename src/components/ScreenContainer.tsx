import { COLORS } from '@/src/constants/styles';
import React from 'react';
import { View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenContainerProps extends ViewProps {
    children: React.ReactNode;
    withPadding?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
    children,
    withPadding = true,
    style,
    ...props
}) => {
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: COLORS.BACKGROUND }}
            className="flex-1"
        >
            <View
                className={`flex-1 ${withPadding ? 'px-6' : ''}`}
                style={style}
                {...props}
            >
                {children}
            </View>
        </SafeAreaView>
    );
};
