import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import { RichText } from '../../../components/RichText';

const tableSetupKeys = [
    'setup.tableSetup.shuffleFortuneTellerDeck',
    'setup.tableSetup.flameMarkerPlacement',
    'setup.tableSetup.chooseIngredientBooks',
    'setup.tableSetup.sortIngredientTokens',
];

const perPlayerItemKeys = [
    'setup.perPlayerSetup.oneCauldronBoard',
    'setup.perPlayerSetup.oneScoringMarker',
    'setup.perPlayerSetup.onePlayerMarker',
    'setup.perPlayerSetup.oneBag',
    'setup.perPlayerSetup.oneRuby',
    'setup.perPlayerSetup.oneFlask',
    'setup.perPlayerSetup.oneDropletMarker',
    'setup.perPlayerSetup.oneRatMarker',
];

const bagTokenKeys = [
    'setup.perPlayerSetup.startingBagContents.white1Bloomberry',
    'setup.perPlayerSetup.startingBagContents.white2Bloomberry',
    'setup.perPlayerSetup.startingBagContents.white3Bloomberry',
    'setup.perPlayerSetup.startingBagContents.orange1Pumpkin',
    'setup.perPlayerSetup.startingBagContents.green1Spider',
];

/**
 * Setup section — renders table setup, per-player setup instructions,
 * and starting bag contents in a table-like layout.
 */
export function Setup() {
    const { t } = useTranslation('quacks');
    const theme = useTheme();

    const parchmentBg = theme.colors.parchment ?? '#f5e6c8';
    const darkText = '#3b2a1a';

    return (
        <View>
            <Text
                style={[
                    styles.heading,
                    { color: theme.colors.accent, fontFamily: theme.fonts.heading },
                ]}
            >
                {t('setup.title')}
            </Text>

            {/* Table Setup */}
            <View style={[styles.parchmentCard, { backgroundColor: parchmentBg }]}>
                <Text style={[styles.subheading, { color: darkText }]}>
                    {t('setup.tableSetup.header')}
                </Text>
                {tableSetupKeys.map((key, i) => (
                    <View key={i} style={styles.listItem}>
                        <Text style={[styles.bullet, { color: theme.colors.accent }]}>•</Text>
                        <RichText
                            value={t(key)}
                            style={{ flex: 1, color: darkText, fontSize: 14, lineHeight: 22 }}
                        />
                    </View>
                ))}
            </View>

            {/* Per-Player Setup */}
            <View style={[styles.parchmentCard, { backgroundColor: parchmentBg, marginTop: 12 }]}>
                <Text style={[styles.subheading, { color: darkText }]}>
                    {t('setup.perPlayerSetup.header')}
                </Text>
                <Text style={[styles.body, { color: darkText }]}>
                    {t('setup.perPlayerSetup.eachPlayerReceives')}
                </Text>
                {perPlayerItemKeys.map((key, i) => (
                    <View key={i} style={styles.listItem}>
                        <Text style={[styles.bullet, { color: theme.colors.accent }]}>•</Text>
                        <RichText
                            value={t(key)}
                            style={{ flex: 1, color: darkText, fontSize: 14, lineHeight: 22 }}
                        />
                    </View>
                ))}
            </View>

            {/* Starting Bag Contents */}
            <View style={[styles.parchmentCard, { backgroundColor: parchmentBg, marginTop: 12 }]}>
                <Text style={[styles.subheading, { color: darkText }]}>
                    {t('setup.perPlayerSetup.startingBagContents.header')}
                </Text>
                {/* Table header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={[styles.tableCell, styles.tableCellToken, { color: darkText }]}>
                        {t('setup.perPlayerSetup.startingBagContents.token')}
                    </Text>
                </View>
                {/* Token rows */}
                {bagTokenKeys.map((key, i) => (
                    <View
                        key={i}
                        style={[
                            styles.tableRow,
                            i % 2 === 1 && { backgroundColor: 'rgba(0,0,0,0.04)' },
                        ]}
                    >
                        <RichText
                            value={t(key)}
                            style={{ flex: 1, color: darkText, fontSize: 14, lineHeight: 22 }}
                        />
                    </View>
                ))}
            </View>

            {/* Scoring Note */}
            <View style={[styles.callout, { borderLeftColor: theme.colors.accent }]}>
                <RichText
                    value={t('setup.scoringNote')}
                    style={{ color: theme.colors.text, fontSize: 14, lineHeight: 22 }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    subheading: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 8,
    },
    body: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 8,
    },
    parchmentCard: {
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#c4a96a',
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
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    tableHeader: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        marginBottom: 4,
    },
    tableCell: {
        fontSize: 14,
        fontWeight: '600',
    },
    tableCellToken: {
        flex: 1,
    },
    callout: {
        marginTop: 12,
        borderLeftWidth: 4,
        backgroundColor: 'rgba(212, 168, 67, 0.1)',
        borderRadius: 4,
        padding: 12,
    },
});
