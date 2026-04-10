import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import { ParchmentCard } from '../../../components/ParchmentCard';
import { RichText } from '../../../components/RichText';

/**
 * Setup section — renders setup instructions including player gets list,
 * shared board setup, first player rules, and bridge note.
 */
export function Setup() {
  const { t } = useTranslation('castles-of-burgundy');
  const theme = useTheme();

  const playerGets = t('setup.playerGets', { returnObjects: true }) as string[];
  const sharedBoard = t('setup.sharedBoard', { returnObjects: true }) as string[];

  return (
    <ParchmentCard>
      <Text style={[styles.heading, { color: '#5a2d0c', fontFamily: theme.fonts.heading }]}>
        {t('setup.heading')}
      </Text>

      <Text style={[styles.body, { color: theme.colors.text, fontFamily: theme.fonts.body }]}>
        {t('setup.intro')}
      </Text>

      <Text style={[styles.subheading, { color: '#7a4420', fontFamily: theme.fonts.heading }]}>
        {t('setup.playerGetsHeading')}
      </Text>
      {playerGets.map((item, i) => (
        <View key={i} style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.colors.accent }]}>⚜</Text>
          <Text style={[styles.listText, { color: theme.colors.text, fontFamily: theme.fonts.body }]}>
            {item}
          </Text>
        </View>
      ))}

      <Text style={[styles.subheading, { color: '#7a4420', fontFamily: theme.fonts.heading }]}>
        {t('setup.sharedBoardHeading')}
      </Text>
      {sharedBoard.map((item, i) => (
        <View key={i} style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.colors.accent }]}>⚜</Text>
          <Text style={[styles.listText, { color: theme.colors.text, fontFamily: theme.fonts.body }]}>
            {item}
          </Text>
        </View>
      ))}

      <Text style={[styles.subheading, { color: '#7a4420', fontFamily: theme.fonts.heading }]}>
        {t('setup.firstPlayerHeading')}
      </Text>
      <RichText
        value={t('setup.firstPlayerRoll')}
        style={{ color: theme.colors.text, fontFamily: theme.fonts.body, fontSize: 15, lineHeight: 24 }}
      />

      <View style={styles.noteContainer}>
        <RichText
          value={t('setup.bridgeNote')}
          style={{ color: theme.colors.textMuted, fontFamily: theme.fonts.body, fontSize: 14, lineHeight: 22 }}
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
    marginBottom: 8,
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
  listText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  noteContainer: {
    marginTop: 16,
  },
});
