import React from 'react';
import { Linking, Platform, Pressable, StyleProp, TextStyle, ViewStyle } from 'react-native';

interface ExternalLinkProps {
    href: string;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle | TextStyle>;
}

/**
 * Platform-aware external link component.
 * On native platforms, opens the URL in the device browser via Linking API.
 * On web, renders a standard anchor tag that opens in a new tab.
 */
export function ExternalLink({ href, children, style }: ExternalLinkProps) {
    if (Platform.OS === 'web') {
        return (
            <a
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                style={{ textDecoration: 'none' }}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </a>
        );
    }

    const handlePress = async () => {
        try {
            await Linking.openURL(href);
        } catch {
            // Silently handle failures — the link simply doesn't open
        }
    };

    return (
        <Pressable onPress={handlePress} style={style}>
            {children}
        </Pressable>
    );
}
