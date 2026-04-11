import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import { RichText } from '../../../components/RichText';

const conversionRows = [
  { costKey: 'finalRound.conversion.fiveMoney', rewardKey: 'finalRound.conversion.oneVP' },
  { costKey: 'finalRound.conversion.twoRubies', rewardKey: 'finalRound.conversion.oneVPAlt' },
];

/**
 * Final Round section — rules for Round 9, including resource
 * conversion, final scoring, and tiebreaker rules.
 */
export function FinalRound() {
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
        {t('finalRound.title')}
      </Text>

      <View style={[styles.parchmentCard, { backgroundColor: parchmentBg }]}>
        <RichText
          value={t('finalRound.intro')}
          style={{ color: darkText, fontSize: 14, lineHeight: 22, marginBottom: 12 }}
        />

        {/* No Shopping */}
        <Text style={[styles.subheading, { color: darkText }]}>
          {t('finalRound.noShopping.header')}
        </Text>
        <RichText
          value={t('finalRound.noShopping.description')}
          style={{ color: darkText, fontSize: 14, lineHeight: 22, marginBottom: 8 }}
        />

        {/* Conversion Table */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { color: darkText }]}>
            {t('finalRound.conversion.cost')}
          </Text>
          <Text style={[styles.tableCell, { color: darkText }]}>
            {t('finalRound.conversion.reward')}
          </Text>
        </View>
        {conversionRows.map((row, i) => (
          <View
            key={i}
            style={[
              styles.tableRow,
              i % 2 === 1 && { backgroundColor: 'rgba(0,0,0,0.04)' },
            ]}
          >
            <Text style={[styles.tableCellBody, { color: darkText }]}>{t(row.costKey)}</Text>
            <Text style={[styles.tableCellBody, { color: darkText }]}>{t(row.rewardKey)}</Text>
          </View>
        ))}

        {/* Final Scoring */}
        <Text style={[styles.subheading, { color: darkText, marginTop: 12 }]}>
          {t('finalRound.finalScoring.header')}
        </Text>
        <Text style={[styles.body, { color: darkText }]}>
          {t('finalRound.finalScoring.description')}
        </Text>

        {/* Tiebreaker */}
        <Text style={[styles.subheading, { color: darkText, marginTop: 12 }]}>
          {t('finalRound.tiebreaker.header')}
        </Text>
        <View style={styles.listItem}>
          <Text style={[styles.ordinal, { color: theme.colors.accent }]}>1.</Text>
          <Text style={[styles.body, { color: darkText, flex: 1 }]}>
            {t('finalRound.tiebreaker.farthestSpace')}
          </Text>
        </View>
        <View style={styles.listItem}>
          <Text style={[styles.ordinal, { color: theme.colors.accent }]}>2.</Text>
          <Text style={[styles.body, { color: darkText, flex: 1 }]}>
            {t('finalRound.tiebreaker.sharedVictory')}
          </Text>
        </View>
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
  ordinal: {
    fontSize: 14,
    fontWeight: '600',
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
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  tableCellBody: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
});
