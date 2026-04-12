import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import { ParchmentCard } from '../../../components/ParchmentCard';

interface TileItem {
    color: string;
    dotClass: string;
    type: string;
    desc: string;
}

/** Maps dot class names to display colors. */
const dotColors: Record<string, string> = {
    'dot-blue': '#4a7fb5',
    'dot-lgreen': '#7cb342',
    'dot-beige': '#c8a96e',
    'dot-dgreen': '#2e7d32',
    'dot-gray': '#9e9e9e',
    'dot-yellow': '#f9a825',
};

/**
 * Tile Types section — renders each tile type as a row with
 * colored dot, name, and description that wraps cleanly on mobile.
 */
export function TileTypes() {
    const { t } = useTranslation('castles-of-burgundy');
    const theme = useTheme();

    const tiles = t('tileTypes.tiles', { returnObjects: true }) as TileItem[];

    return (
        <ParchmentCard>
            <Text style={[styles.heading, { color: '#5a2d0c', fontFamily: theme.fonts.heading }]}>
                {t('tileTypes.heading')}
            </Text>

            {tiles.map((tile, i) => (
                <View
                    key={i}
                    style={[
                        styles.tileRow,
                        { backgroundColor: i % 2 === 0 ? '#faf3e6' : '#f5ead0' },
                    ]}
                >
                    <View style={styles.tileHeader}>
                        <View
                            style={[
                                styles.dot,
                                {
                                    backgroundColor:
                                        dotColors[tile.dotClass] ?? theme.colors.accent,
                                },
                            ]}
                        />
                        <Text
                            style={[
                                styles.tileColor,
                                { color: theme.colors.textMuted, fontFamily: theme.fonts.body },
                            ]}
                        >
                            {tile.color}
                        </Text>
                        <Text
                            style={[
                                styles.tileType,
                                { color: theme.colors.text, fontFamily: theme.fonts.heading },
                            ]}
                        >
                            {tile.type}
                        </Text>
                    </View>
                    <Text
                        style={[
                            styles.tileDesc,
                            { color: theme.colors.text, fontFamily: theme.fonts.body },
                        ]}
                    >
                        {tile.desc}
                    </Text>
                </View>
            ))}
        </ParchmentCard>
    );
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#c9a84c',
    },
    tileRow: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 6,
    },
    tileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    dot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.15)',
    },
    tileColor: {
        fontSize: 13,
    },
    tileType: {
        fontSize: 15,
        fontWeight: '600',
    },
    tileDesc: {
        fontSize: 14,
        lineHeight: 21,
        paddingLeft: 22,
    },
});
