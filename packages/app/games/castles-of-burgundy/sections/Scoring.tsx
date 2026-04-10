import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import { ParchmentCard } from '../../../components/ParchmentCard';
import { RichText } from '../../../components/RichText';

/**
 * Scoring section — renders scoring rules for areas, color completion,
 * and bridge/turn order.
 */
export function Scoring() {
  const { t } = useTranslation('castles-of-burgundy');
  const theme = useTheme();

  const areasCriteria = t('scoring.areasCriteria', { returnObjects: true }) as string[];

  return (
    <ParchmentCard>
      <Text style={[styles.heading, { color: '#5a2d0c', fontFamily: theme.fonts.heading }]}>
        {t('scoring.heading')}
      </Text>

      {/* Completing Areas */}
      <Text style={[styles.subheading, { color: '#7a4420', fontFamily: theme.fonts.heading }]}>
        {t('scoring.areasHeading')}
      </Text>
      <Text style={[styles.body, { color: theme.colors.text, fontFamily: theme.fonts.body }]}>
        {t('scoring.areasDesc')}
      </Text>
      {areasCriteria.map((item, i) => (
        <View key={i} style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.colors.accent }]}>⚜</Text>
          <RichText
            value={item}
            style={{ flex: 1, color: theme.colors.text, fontFamily: theme.fonts.body, fontSize: 15, lineHeight: 22 }}
          />
        </View>
      ))}

      {/* Completing a Color */}
      <Text style={[styles.subheading, { color: '#7a4420', fontFamily: theme.fonts.heading }]}>
        {t('scoring.colorHeading')}
      </Text>
      <Text style={[styles.body, { color: theme.colors.text, fontFamily: theme.fonts.body }]}>
        {t('scoring.colorDesc')}
      </Text>

      {/* Turn Order / Bridge */}
      <Text style={[styles.subheading, { color: '#7a4420', fontFamily: theme.fonts.heading }]}>
        {t('scoring.bridgeHeading')}
      </Text>
      <Text style={[styles.body, { color: theme.colors.text, fontFamily: theme.fonts.body }]}>
        {t('scoring.bridgeDesc')}
      </Text>
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
});
