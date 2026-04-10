import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import { ParchmentCard } from '../../../components/ParchmentCard';
import { RichText } from '../../../components/RichText';

/**
 * Game Flow section — renders phase pills (A–E), start/end of phase steps,
 * and round description.
 */
export function GameFlow() {
  const { t } = useTranslation('castles-of-burgundy');
  const theme = useTheme();

  const phases = t('gameFlow.phases', { returnObjects: true }) as string[];
  const startSteps = t('gameFlow.startSteps', { returnObjects: true }) as string[];
  const endSteps = t('gameFlow.endSteps', { returnObjects: true }) as string[];

  return (
    <ParchmentCard>
      <Text style={[styles.heading, { color: '#5a2d0c', fontFamily: theme.fonts.heading }]}>
        {t('gameFlow.heading')}
      </Text>

      <RichText
        value={t('gameFlow.intro')}
        style={{ color: theme.colors.text, fontFamily: theme.fonts.body, fontSize: 15, lineHeight: 24 }}
      />

      {/* Phase pills */}
      <View style={styles.phaseRow}>
        {phases.map((phase) => (
          <View key={phase} style={[styles.phasePill, { backgroundColor: '#6b3a20' }]}>
            <Text style={[styles.phaseText, { color: '#f0d68a' }]}>
              {phase}
            </Text>
          </View>
        ))}
        <Text style={[styles.roundsLabel, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
          × 5 {t('gameFlow.roundsLabel')}
        </Text>
      </View>

      {/* Start of each phase */}
      <Text style={[styles.subheading, { color: '#7a4420', fontFamily: theme.fonts.heading }]}>
        {t('gameFlow.startHeading')}
      </Text>
      {startSteps.map((step, i) => (
        <View key={i} style={styles.listItem}>
          <Text style={[styles.stepNum, { color: theme.colors.accent }]}>{i + 1}.</Text>
          <Text style={[styles.listText, { color: theme.colors.text, fontFamily: theme.fonts.body }]}>
            {step}
          </Text>
        </View>
      ))}

      {/* End of each phase */}
      <Text style={[styles.subheading, { color: '#7a4420', fontFamily: theme.fonts.heading }]}>
        {t('gameFlow.endHeading')}
      </Text>
      {endSteps.map((step, i) => (
        <View key={i} style={styles.listItem}>
          <Text style={[styles.stepNum, { color: theme.colors.accent }]}>{i + 1}.</Text>
          <Text style={[styles.listText, { color: theme.colors.text, fontFamily: theme.fonts.body }]}>
            {step}
          </Text>
        </View>
      ))}

      {/* Each round */}
      <Text style={[styles.subheading, { color: '#7a4420', fontFamily: theme.fonts.heading }]}>
        {t('gameFlow.roundHeading')}
      </Text>
      <Text style={[styles.body, { color: theme.colors.text, fontFamily: theme.fonts.body }]}>
        {t('gameFlow.roundDesc')}
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
  },
  phaseRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
    gap: 8,
  },
  phasePill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  phaseText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  roundsLabel: {
    fontSize: 14,
    marginLeft: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    paddingLeft: 4,
  },
  stepNum: {
    fontSize: 15,
    fontWeight: '600',
    marginRight: 8,
    minWidth: 18,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
});
