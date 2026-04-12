import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';

interface StatItem {
    labelKey: string;
    valueKey: string;
}

const stats: StatItem[] = [
    { labelKey: 'overview.rounds', valueKey: '9' },
    { labelKey: 'overview.turns', valueKey: 'overview.simultaneous' },
    { labelKey: 'overview.goal', valueKey: 'overview.mostVictoryPoints' },
];

/**
 * Overview section — displays game stats (Rounds, Turns, Goal)
 * in a horizontal row of small cards with wrapping.
 */
export function Overview() {
    const { t } = useTranslation('quacks');
    const theme = useTheme();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: theme.colors.cardAlt ?? theme.colors.card,
                    borderColor: theme.colors.border ?? '#4a2d6e',
                },
            ]}
        >
            <View style={styles.statsRow}>
                {stats.map(stat => (
                    <View
                        key={stat.labelKey}
                        style={[styles.statCard, { backgroundColor: theme.colors.card }]}
                    >
                        <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
                            {t(stat.labelKey)}
                        </Text>
                        <Text
                            style={[
                                styles.statValue,
                                { color: theme.colors.accent, fontFamily: theme.fonts.heading },
                            ]}
                        >
                            {stat.valueKey.startsWith('overview.')
                                ? t(stat.valueKey)
                                : stat.valueKey}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
    },
    statsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
    },
    statCard: {
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        minWidth: 90,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '600',
    },
});
