import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import { ParchmentCard } from '../../../components/ParchmentCard';
import { RichText } from '../../../components/RichText';

/**
 * End of Game section — renders final bonus points list and winner text.
 */
export function EndOfGame() {
    const { t } = useTranslation('castles-of-burgundy');
    const theme = useTheme();

    const bonuses = t('endOfGame.bonuses', { returnObjects: true }) as string[];

    return (
        <ParchmentCard>
            <Text style={[styles.heading, { color: '#5a2d0c', fontFamily: theme.fonts.heading }]}>
                {t('endOfGame.heading')}
            </Text>
            <Text style={[styles.body, { color: theme.colors.text, fontFamily: theme.fonts.body }]}>
                {t('endOfGame.intro')}
            </Text>

            <Text
                style={[styles.subheading, { color: '#7a4420', fontFamily: theme.fonts.heading }]}
            >
                {t('endOfGame.bonusHeading')}
            </Text>
            {bonuses.map((bonus, i) => (
                <View key={i} style={styles.listItem}>
                    <Text style={[styles.bullet, { color: theme.colors.accent }]}>⚜</Text>
                    <RichText
                        value={bonus}
                        style={{
                            flex: 1,
                            color: theme.colors.text,
                            fontFamily: theme.fonts.body,
                            fontSize: 15,
                            lineHeight: 22,
                        }}
                    />
                </View>
            ))}

            <View style={styles.winnerContainer}>
                <RichText
                    value={t('endOfGame.winner')}
                    style={{
                        color: theme.colors.text,
                        fontFamily: theme.fonts.body,
                        fontSize: 15,
                        lineHeight: 24,
                    }}
                />
            </View>
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
    subheading: {
        fontSize: 17,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },
    body: {
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 4,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 4,
        paddingLeft: 4,
    },
    bullet: {
        fontSize: 15,
        marginRight: 8,
        marginTop: 2,
    },
    winnerContainer: {
        marginTop: 16,
    },
});
