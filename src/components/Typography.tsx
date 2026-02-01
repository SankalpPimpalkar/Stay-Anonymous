import { COLORS } from '@/src/constants/styles';
import React from 'react';
import { Text, TextProps } from 'react-native';

interface TypographyProps extends TextProps {
    children: React.ReactNode;
}

export const Heading: React.FC<TypographyProps> = ({ children, className, style, ...props }) => (
    <Text
        className={`text-3xl font-extrabold ${className || ''}`}
        style={[{ color: COLORS.TEXT_PRIMARY }, style]}
        {...props}
    >
        {children}
    </Text>
);

export const Subheading: React.FC<TypographyProps> = ({ children, className, style, ...props }) => (
    <Text
        className={`text-xl font-bold ${className || ''}`}
        style={[{ color: COLORS.TEXT_PRIMARY }, style]}
        {...props}
    >
        {children}
    </Text>
);

export const Body: React.FC<TypographyProps> = ({ children, className, style, ...props }) => (
    <Text
        className={`text-base ${className || ''}`}
        style={[{ color: COLORS.TEXT_PRIMARY }, style]}
        {...props}
    >
        {children}
    </Text>
);

export const Label: React.FC<TypographyProps> = ({ children, className, style, ...props }) => (
    <Text
        className={`text-sm font-semibold mb-2 ${className || ''}`}
        style={[{ color: COLORS.TEXT_SECONDARY }, style]}
        {...props}
    >
        {children}
    </Text>
);

export const Muted: React.FC<TypographyProps> = ({ children, className, style, ...props }) => (
    <Text
        className={`text-sm ${className || ''}`}
        style={[{ color: COLORS.TEXT_MUTED }, style]}
        {...props}
    >
        {children}
    </Text>
);
