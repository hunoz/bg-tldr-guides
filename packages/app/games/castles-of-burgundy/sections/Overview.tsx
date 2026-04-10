import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import { ParchmentCard } from '../../../components/ParchmentCard';

/**
 * Overview section — renders the game overview heading and body text.
 */
export function Overview() {
  const { t } = useTranslation('castles-of-burgundy');
  const theme = useTheme();

  return (
    <ParchmentCard>
      <Text style={[styles.heading, { color: '#5a2d0c', fontFamily: theme.fonts.heading }]}>
        {t('overview.heading')}
      </Text>
      <Text style={[styles.body, { color: theme.colors.text, fontFamily: theme.fonts.body }]}>
        {t('overview.body')}
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
  body: {
    fontSize: 15,
    lineHeight: 24,
  },
});
