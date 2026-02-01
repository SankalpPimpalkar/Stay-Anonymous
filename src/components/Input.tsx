import { COLORS } from '@/src/constants/styles';
import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { Label } from './Typography';

interface InputProps extends TextInputProps {
    label?: string;
}

export const Input: React.FC<InputProps> = ({ label, style, ...props }) => {
    return (
        <View className="gap-2">
            {label && <Label>{label}</Label>}
            <TextInput
                placeholderTextColor={COLORS.INPUT_PLACEHOLDER}
                style={[
                    {
                        backgroundColor: COLORS.INPUT_BACKGROUND,
                        borderColor: COLORS.INPUT_BORDER,
                        borderWidth: 1,
                        borderRadius: 18,
                        padding: 16,
                        color: COLORS.TEXT_PRIMARY,
                        fontSize: 16,
                    },
                    props.multiline ? { height: 160, textAlignVertical: 'top' } : {},
                    style,
                ]}
                {...props}
            />
        </View>
    );
};
