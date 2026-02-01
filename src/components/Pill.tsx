import { COLORS } from '@/src/constants/styles';
import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface PillProps extends TouchableOpacityProps {
    label: string;
    isSelected?: boolean;
}

export const Pill: React.FC<PillProps> = ({ label, isSelected = false, style, ...props }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className={`px-4 py-2 rounded-full border ${isSelected ? 'bg-black' : 'bg-transparent'}`}
            style={[
                {
                    borderColor: isSelected ? COLORS.ACCENT : COLORS.BORDER,
                    backgroundColor: isSelected ? COLORS.ACCENT : 'transparent',
                },
                style,
            ]}
            {...props}
        >
            <Text
                className={`font-medium ${isSelected ? 'text-white' : 'text-gray-500'}`}
                style={{ color: isSelected ? '#fff' : COLORS.TEXT_SECONDARY }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};
