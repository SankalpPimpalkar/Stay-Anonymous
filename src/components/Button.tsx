import { COLORS } from '@/src/constants/styles';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    label: string;
    variant?: 'primary' | 'secondary' | 'danger';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    label,
    variant = 'primary',
    isLoading = false,
    disabled,
    style,
    ...props
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    container: { backgroundColor: COLORS.ERROR, borderWidth: 1 },
                    text: { color: COLORS.BUTTON_PRIMARY_TEXT },
                };
            case 'secondary':
                return {
                    container: { backgroundColor: COLORS.BUTTON_SECONDARY },
                    text: { color: COLORS.TEXT_PRIMARY },
                };
            case 'primary':
            default:
                return {
                    container: { backgroundColor: COLORS.BUTTON_PRIMARY },
                    text: { color: COLORS.BUTTON_PRIMARY_TEXT },
                };
        }
    };

    const { container, text } = getVariantStyles();

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            className="p-4 rounded-xl flex-row justify-center items-center"
            style={[
                container,
                { opacity: (disabled || isLoading) ? 0.6 : 1 },
                style
            ]}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator color={text.color} />
            ) : (
                <Text
                    className="font-semibold text-center text-lg"
                    style={text}
                >
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
};
