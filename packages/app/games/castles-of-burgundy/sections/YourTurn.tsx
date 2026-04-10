import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import { ParchmentCard } from '../../../components/ParchmentCard';
import { RichText } from '../../../components/RichText';

interface ActionItem {
  icon: string;
  title: string;
  desc: string;
}

/**
 * Your Turn section — renders action cards in a two-column layout
 * with numbered badges, plus buy-from-center and worker tip.
 */
export function YourTurn() {
  const { t } = useTranslation('castles-of-burgundy');
  const theme = useTheme();

  const actions = t('yourTurn.actions', { returnObjects: true }) as ActionItem[];

  return (
    <ParchmentCard>
      <Text style={[styles.heading, { color: '#5a2d0c', fontFamily: theme.fonts.heading }]}>
        {t('yourTurn.heading')}
      </Text>

      <RichText
        value={t('yourTurn.intro')}
        style={{ color: theme.colors.text, fontFamily: theme.fonts.body, fontSize: 15, lineHeight: 24 }}
      />

      {/* Action cards in two-column layout */}
      <View style={styles.actionGrid}>
        {actions.map((action, i) => (
          <View
            key={i}
            style={[styles.actionCard, { backgroundColor: theme.colors.cardAlt ?? theme.colors.card, borderColor: theme.colors.border ?? theme.colors.accent }]}
          >
            <View style={styles.actionHeader}>
              <View style={[styles.badge, { backgroundColor: '#5a2d0c' }]}>
                <Text style={[styles.badgeText, { color: '#f0d68a' }]}>
                  {i + 1}
                </Text>
              </View>
              <Text style={styles.actionIcon}>{action.icon}</Text>
            </View>
            <Text style={[styles.actionTitle, { color: '#5a2d0c', fontFamily: theme.fonts.heading }]}>
              {action.title}
            </Text>
            <Text style={[styles.actionDesc, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
              {action.desc}
            </Text>
          </View>
        ))}
      </View>

      {/* Buy from center */}
      <View style={styles.tipContainer}>
        <RichText
          value={t('yourTurn.buyCenter')}
          style={{ color: theme.colors.text, fontFamily: theme.fonts.body, fontSize: 15, lineHeight: 24 }}
        />
      </View>

      {/* Worker tip */}
      <View style={styles.tipContainer}>
        <RichText
          value={t('yourTurn.workerTip')}
          style={{ color: theme.colors.text, fontFamily: theme.fonts.body, fontSize: 15, lineHeight: 24 }}
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
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
    marginBottom: 12,
  },
  actionCard: {
    borderWidth: 1,
    borderRadius: 10,
    paddingTop: 14,
    paddingHorizontal: 12,
    paddingBottom: 12,
    width: '48%',
    flexGrow: 1,
    minWidth: 140,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  actionIcon: {
    fontSize: 20,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 13,
    lineHeight: 20,
  },
  tipContainer: {
    marginTop: 12,
  },
});
