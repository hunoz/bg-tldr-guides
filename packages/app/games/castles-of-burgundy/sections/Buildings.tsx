import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import { ParchmentCard } from '../../../components/ParchmentCard';

interface BuildingItem {
    icon: string;
    name: string;
    effect: string;
}

/**
 * Buildings section — renders each building as a stacked row with
 * icon + name on top and effect description below.
 */
export function Buildings() {
    const { t } = useTranslation('castles-of-burgundy');
    const theme = useTheme();

    const items = t('buildings.items', { returnObjects: true }) as BuildingItem[];

    return (
        <ParchmentCard>
            <Text style={[styles.heading, { color: '#5a2d0c', fontFamily: theme.fonts.heading }]}>
                {t('buildings.heading')}
            </Text>
            <Text
                style={[
                    styles.subtitle,
                    { color: theme.colors.textMuted, fontFamily: theme.fonts.body },
                ]}
            >
                {t('buildings.subtitle')}
            </Text>
            <Text
                style={[styles.intro, { color: theme.colors.text, fontFamily: theme.fonts.body }]}
            >
                {t('buildings.intro')}
            </Text>

            {items.map((item, i) => (
                <View
                    key={i}
                    style={[
                        styles.buildingRow,
                        { backgroundColor: i % 2 === 0 ? '#faf3e6' : '#f5ead0' },
                    ]}
                >
                    <View style={styles.buildingHeader}>
                        <Text style={styles.buildingIcon}>{item.icon}</Text>
                        <Text
                            style={[
                                styles.buildingName,
                                { color: theme.colors.text, fontFamily: theme.fonts.heading },
                            ]}
                        >
                            {item.name}
                        </Text>
                    </View>
                    <Text
                        style={[
                            styles.buildingEffect,
                            { color: theme.colors.text, fontFamily: theme.fonts.body },
                        ]}
                    >
                        {item.effect}
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
        marginBottom: 2,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#c9a84c',
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 8,
    },
    intro: {
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 12,
    },
    buildingRow: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 6,
    },
    buildingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    buildingIcon: {
        fontSize: 20,
    },
    buildingName: {
        fontSize: 15,
        fontWeight: '600',
    },
    buildingEffect: {
        fontSize: 14,
        lineHeight: 21,
        paddingLeft: 28,
    },
});
