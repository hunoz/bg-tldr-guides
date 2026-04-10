import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import { ParchmentCard } from '../../../components/ParchmentCard';

interface MonasteryItem {
  num: string;
  text: string;
}

/**
 * Monasteries section — renders numbered monastery cards in a two-column
 * layout with ongoing abilities and end-of-game scoring sections.
 */
export function Monasteries() {
  const { t } = useTranslation('castles-of-burgundy');
  const theme = useTheme();

  const ongoing = t('monasteries.ongoing', { returnObjects: true }) as MonasteryItem[];
  const endGame = t('monasteries.endGame', { returnObjects: true }) as MonasteryItem[];

  const renderCards = (items: MonasteryItem[]) => (
    <View style={styles.cardGrid}>
      {items.map((item, i) => (
        <View
          key={i}
          style={[styles.monasteryCard, { backgroundColor: theme.colors.cardAlt ?? theme.colors.card, borderColor: theme.colors.border ?? theme.colors.accent }]}
        >
          <Text style={[styles.monasteryNum, { color: theme.colors.accent, fontFamily: theme.fonts.heading }]}>
            {item.num}
          </Text>
          <Text style={[styles.monasteryText, { color: theme.colors.text, fontFamily: theme.fonts.body }]}>
            {item.text}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <ParchmentCard>
      <Text style={[styles.heading, { color: '#5a2d0c', fontFamily: theme.fonts.heading }]}>
        {t('monasteries.heading')}
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
        {t('monasteries.subtitle')}
      </Text>
      <Text style={[styles.intro, { color: theme.colors.text, fontFamily: theme.fonts.body }]}>
        {t('monasteries.intro')}
      </Text>

      {/* Ongoing abilities */}
      <Text style={[styles.subheading, { color: '#7a4420', fontFamily: theme.fonts.heading }]}>
        {t('monasteries.ongoingHeading')}
      </Text>
      {renderCards(ongoing)}

      {/* End-of-game scoring */}
      <Text style={[styles.subheading, { color: '#7a4420', fontFamily: theme.fonts.heading }]}>
        {t('monasteries.endGameHeading')}
      </Text>
      {renderCards(endGame)}
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
    marginBottom: 8,
  },
  subheading: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 10,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  monasteryCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    width: '48%',
    flexGrow: 1,
    minWidth: 140,
  },
  monasteryNum: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  monasteryText: {
    fontSize: 13,
    lineHeight: 20,
  },
});
