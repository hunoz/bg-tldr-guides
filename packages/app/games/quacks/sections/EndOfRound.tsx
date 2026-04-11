import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import { RichText } from '../../../components/RichText';

const rewardKeys = [
  'endOfRound.bonusDie.reward1',
  'endOfRound.bonusDie.reward2',
  'endOfRound.bonusDie.reward3',
  'endOfRound.bonusDie.reward4',
  'endOfRound.bonusDie.reward5',
];

const scoringRows = [
  { outcomeKey: 'endOfRound.scoring.didntExplode', rewardKey: 'endOfRound.scoring.didntExplodeReward' },
  { outcomeKey: 'endOfRound.scoring.exploded', rewardKey: 'endOfRound.scoring.explodedReward' },
];

const shoppingBulletKeys = [
  'endOfRound.shopping.buyTokens',
  'endOfRound.shopping.costsListed',
  'endOfRound.shopping.limitedSupply',
  'endOfRound.shopping.unspentMoney',
];

const rubyRows = [
  { actionKey: 'endOfRound.spendRubies.refillFlask', effectKey: 'endOfRound.spendRubies.refillFlaskEffect' },
  { actionKey: 'endOfRound.spendRubies.advanceDroplet', effectKey: 'endOfRound.spendRubies.advanceDropletEffect' },
];

const ratStepKeys = [
  'endOfRound.rats.step1',
  'endOfRound.rats.step2',
  'endOfRound.rats.step3',
];

const nextRoundBulletKeys = [
  'endOfRound.nextRound.moveFlame',
  'endOfRound.nextRound.passDeck',
  'endOfRound.nextRound.tokensInBag',
];

/**
 * End of Round section — full checklist covering bonus die, ingredient
 * effects, rubies, scoring, shopping, ruby spending, rats, and next round.
 */
export function EndOfRound() {
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
        {t('endOfRound.title')}
      </Text>

      {/* a) Bonus Die */}
      <Text style={[styles.sectionHeader, { color: theme.colors.accent }]}>
        {t('endOfRound.bonusDie.header')}
      </Text>
      <View style={[styles.parchmentCard, { backgroundColor: parchmentBg }]}>
        <RichText
          value={t('endOfRound.bonusDie.description')}
          style={{ color: darkText, fontSize: 14, lineHeight: 22, marginBottom: 8 }}
        />
        <Text style={[styles.body, { color: darkText, marginBottom: 12 }]}>
          {t('endOfRound.bonusDie.finalSpaceNote')}
        </Text>
        <Text style={[styles.subheading, { color: darkText }]}>
          {t('endOfRound.bonusDie.rewardsHeader')}
        </Text>
        <View style={styles.rewardsRow}>
          {rewardKeys.map((key, i) => (
            <View key={i} style={[styles.rewardChip, { backgroundColor: theme.colors.card }]}>
              <RichText
                value={t(key)}
                style={{ color: theme.colors.text, fontSize: 13, textAlign: 'center' }}
              />
            </View>
          ))}
        </View>
      </View>

      {/* b) Post-Draw Ingredient Effects */}
      <Text style={[styles.sectionHeader, { color: theme.colors.accent }]}>
        {t('endOfRound.ingredientEffects.header')}
      </Text>
      <View style={[styles.parchmentCard, { backgroundColor: parchmentBg }]}>
        <RichText
          value={t('endOfRound.ingredientEffects.description')}
          style={{ color: darkText, fontSize: 14, lineHeight: 22 }}
        />
      </View>

      {/* c) Bonus Rubies */}
      <Text style={[styles.sectionHeader, { color: theme.colors.accent }]}>
        {t('endOfRound.bonusRubies.header')}
      </Text>
      <View style={[styles.parchmentCard, { backgroundColor: parchmentBg }]}>
        <Text style={[styles.body, { color: darkText }]}>
          {t('endOfRound.bonusRubies.description')}
        </Text>
      </View>

      {/* d) Scoring */}
      <Text style={[styles.sectionHeader, { color: theme.colors.accent }]}>
        {t('endOfRound.scoring.header')}
      </Text>
      <View style={[styles.parchmentCard, { backgroundColor: parchmentBg }]}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { color: darkText }]}>
            {t('endOfRound.scoring.outcome')}
          </Text>
          <Text style={[styles.tableCell, { color: darkText }]}>
            {t('endOfRound.scoring.reward')}
          </Text>
        </View>
        {scoringRows.map((row, i) => (
          <View
            key={i}
            style={[styles.tableRow, i % 2 === 1 && { backgroundColor: 'rgba(0,0,0,0.04)' }]}
          >
            <Text style={[styles.tableCellBody, { color: darkText }]}>{t(row.outcomeKey)}</Text>
            <RichText
              value={t(row.rewardKey)}
              style={{ flex: 1, color: darkText, fontSize: 14, lineHeight: 22 }}
            />
          </View>
        ))}
        <RichText
          value={t('endOfRound.scoring.vpNote')}
          style={{ color: darkText, fontSize: 14, lineHeight: 22, marginTop: 8 }}
        />
      </View>

      {/* e) Shopping */}
      <Text style={[styles.sectionHeader, { color: theme.colors.accent }]}>
        {t('endOfRound.shopping.header')}
      </Text>
      <View style={[styles.parchmentCard, { backgroundColor: parchmentBg }]}>
        <Text style={[styles.body, { color: darkText, marginBottom: 8 }]}>
          {t('endOfRound.shopping.description')}
        </Text>
        {shoppingBulletKeys.map((key, i) => (
          <View key={i} style={styles.listItem}>
            <Text style={[styles.bullet, { color: theme.colors.accent }]}>•</Text>
            <RichText
              value={t(key)}
              style={{ flex: 1, color: darkText, fontSize: 14, lineHeight: 22 }}
            />
          </View>
        ))}
        <View style={[styles.callout, { borderLeftColor: theme.colors.accent }]}>
          <RichText
            value={t('endOfRound.shopping.availability')}
            style={{ color: darkText, fontSize: 14, lineHeight: 22 }}
          />
        </View>
        <Text style={[styles.body, { color: darkText, marginTop: 8 }]}>
          {t('endOfRound.shopping.returnTokens')}
        </Text>
      </View>

      {/* f) Spend Rubies */}
      <Text style={[styles.sectionHeader, { color: theme.colors.accent }]}>
        {t('endOfRound.spendRubies.header')}
      </Text>
      <View style={[styles.parchmentCard, { backgroundColor: parchmentBg }]}>
        <RichText
          value={t('endOfRound.spendRubies.description')}
          style={{ color: darkText, fontSize: 14, lineHeight: 22, marginBottom: 8 }}
        />
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { color: darkText }]}>
            {t('endOfRound.spendRubies.action')}
          </Text>
          <Text style={[styles.tableCell, { color: darkText }]}>
            {t('endOfRound.spendRubies.effect')}
          </Text>
        </View>
        {rubyRows.map((row, i) => (
          <View
            key={i}
            style={[styles.tableRow, i % 2 === 1 && { backgroundColor: 'rgba(0,0,0,0.04)' }]}
          >
            <Text style={[styles.tableCellBody, { color: darkText }]}>{t(row.actionKey)}</Text>
            <Text style={[styles.tableCellBody, { color: darkText }]}>{t(row.effectKey)}</Text>
          </View>
        ))}
      </View>

      {/* g) Rats */}
      <Text style={[styles.sectionHeader, { color: theme.colors.accent }]}>
        {t('endOfRound.rats.header')}
      </Text>
      <View style={[styles.parchmentCard, { backgroundColor: parchmentBg }]}>
        <RichText
          value={t('endOfRound.rats.description')}
          style={{ color: darkText, fontSize: 14, lineHeight: 22, marginBottom: 8 }}
        />
        {ratStepKeys.map((key, i) => (
          <View key={i} style={styles.listItem}>
            <Text style={[styles.ordinal, { color: theme.colors.accent }]}>{i + 1}.</Text>
            <Text style={[styles.body, { color: darkText, flex: 1 }]}>{t(key)}</Text>
          </View>
        ))}
        <View style={[styles.callout, { borderLeftColor: theme.colors.accent }]}>
          <RichText
            value={t('endOfRound.rats.note')}
            style={{ color: darkText, fontSize: 14, lineHeight: 22 }}
          />
        </View>
      </View>

      {/* h) Advance to Next Round */}
      <Text style={[styles.sectionHeader, { color: theme.colors.accent }]}>
        {t('endOfRound.nextRound.header')}
      </Text>
      <View style={[styles.parchmentCard, { backgroundColor: parchmentBg }]}>
        {nextRoundBulletKeys.map((key, i) => (
          <View key={i} style={styles.listItem}>
            <Text style={[styles.bullet, { color: theme.colors.accent }]}>•</Text>
            <Text style={[styles.body, { color: darkText, flex: 1 }]}>{t(key)}</Text>
          </View>
        ))}
        <View style={[styles.callout, { borderLeftColor: theme.colors.accent }]}>
          <RichText
            value={t('endOfRound.nextRound.round6Special')}
            style={{ color: darkText, fontSize: 14, lineHeight: 22 }}
          />
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
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
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
  rewardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rewardChip: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 80,
    alignItems: 'center',
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
  callout: {
    marginTop: 10,
    borderLeftWidth: 4,
    backgroundColor: 'rgba(212, 168, 67, 0.1)',
    borderRadius: 4,
    padding: 12,
  },
});
