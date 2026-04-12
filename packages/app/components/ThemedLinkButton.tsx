import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { ExternalLink } from './ExternalLink';

interface ThemedLinkButtonProps {
    href: string;
    label: string;
    icon?: string;
}

/**
 * A themed button that opens an external link.
 * Adapts accent color and text from the current game theme.
 */
export function ThemedLinkButton({ href, label, icon }: ThemedLinkButtonProps) {
    const theme = useTheme();

    return (
        <ExternalLink href={href}>
            <View
                style={[
                    styles.button,
                    {
                        backgroundColor: theme.colors.accent + '20',
                        borderColor: theme.colors.accent,
                    },
                ]}
            >
                <Text style={[styles.label, { color: theme.colors.accent }]}>
                    {icon ? `${icon}  ` : ''}
                    {label} ↗
                </Text>
            </View>
        </ExternalLink>
    );
}

const styles = StyleSheet.create({
    button: {
        borderWidth: 1.5,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        alignSelf: 'center',
        ...Platform.select({
            web: { cursor: 'pointer' } as never,
            default: {},
        }),
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});
