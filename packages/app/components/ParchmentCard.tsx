import React from 'react';
import { Platform, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ParchmentCardProps {
    /** Visual variant: 'light' uses parchment/card background, 'dark' uses cardAlt or darker tone */
    variant?: 'light' | 'dark';
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

/**
 * Reusable card with a parchment-style background and decorative inner border.
 * Adapts colors to the current theme for use across different game screens.
 */
export function ParchmentCard({ variant = 'light', children, style }: ParchmentCardProps) {
    const theme = useTheme();

    const outerBackground =
        variant === 'light'
            ? (theme.colors.parchment ?? theme.colors.card)
            : (theme.colors.cardAlt ?? theme.colors.card);

    const borderColor = theme.colors.border ?? theme.colors.accent;

    return (
        <View style={[styles.outer, { backgroundColor: outerBackground, borderColor }, style]}>
            <View style={[styles.inner, { borderColor }]}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    outer: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 4,
        ...Platform.select({
            web: {
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            } as never,
            default: {
                elevation: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
            },
        }),
    },
    inner: {
        borderWidth: 1,
        borderRadius: 8,
        borderStyle: 'solid',
        padding: 16,
    },
});
