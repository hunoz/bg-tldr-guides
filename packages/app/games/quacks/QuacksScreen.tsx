import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { useSideNavStore } from '../../stores/sidenav';
import { useScrollTracker } from '../../hooks/useScrollTracker';
import { ThemedLinkButton } from '../../components/ThemedLinkButton';
import { getManualUrl } from '../../utils/constants';
import { Overview } from './sections/Overview';
import { Setup } from './sections/Setup';
import { RoundStructure } from './sections/RoundStructure';
import { EndOfRound } from './sections/EndOfRound';
import { FinalRound } from './sections/FinalRound';

const sectionIds = [
  'overview',
  'setup',
  'roundStructure',
  'endOfRound',
  'finalRound',
] as const;

const sectionComponents: Record<string, React.ComponentType> = {
  overview: Overview,
  setup: Setup,
  roundStructure: RoundStructure,
  endOfRound: EndOfRound,
  finalRound: FinalRound,
};

/** Section labels for the SideNav. Maps section IDs to translation keys or fallback labels. */
const sectionLabels: Record<string, string | null> = {
  overview: null,
  setup: 'setup.title',
  roundStructure: 'roundStructure.title',
  endOfRound: null,
  finalRound: null,
};

/**
 * Main Quacks of Quedlinburg game screen.
 * Renders a scrollable guide with header, 5 content sections, and footer.
 */
export function QuacksScreen() {
  const common = useTranslation('common');
  const { t, i18n: i18nInstance } = useTranslation('quacks');
  const theme = useTheme();
  const router = useRouter();
  const { setGroups, setActiveId } = useSideNavStore();
  const {
    handleScroll,
    getSectionLayoutHandler,
    scrollToSection,
    activeId,
    scrollViewRef,
  } = useScrollTracker([...sectionIds]);

  // Set SideNav groups on mount
  useEffect(() => {
    setGroups([
      {
        items: [
          {
            id: 'back',
            label: t('common:all-games', { ns: 'common' }),
            icon: '←',
            onSelect: () => router.push('/'),
          },
          ...sectionIds.map((id) => ({
            id,
            label: sectionLabels[id] ? t(sectionLabels[id]!) : id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1'),
            sectionId: id,
            onSelect: () => scrollToSection(id),
          })),
        ],
      },
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18nInstance.language]);

  // Sync active section to Zustand store
  useEffect(() => {
    setActiveId(activeId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  return (
    <ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.dividerIcon}>{t('app.icon')}</Text>
        <Text
          style={[
            styles.title,
            { color: theme.colors.accent, fontFamily: theme.fonts.heading },
          ]}
        >
          {t('app.title')}
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: theme.colors.textMuted, fontFamily: theme.fonts.body },
          ]}
        >
          {t('header.rulesReference')}
        </Text>
        <View style={styles.headerButtons}>
          <ThemedLinkButton
            href="https://boardgamegeek.com/boardgame/244521/the-quacks-of-quedlinburg"
            label={common.t('bggButton')}
          />
          <ThemedLinkButton
            href={getManualUrl('quacks')}
            label={common.t('manualsButton')}
          />
        </View>
      </View>

      {/* Sections */}
      {sectionIds.map((id) => {
        const SectionComponent = sectionComponents[id];
        return (
          <View
            key={id}
            onLayout={getSectionLayoutHandler(id)}
            style={{ marginBottom: theme.spacing.sectionMargin }}
          >
            <SectionComponent />
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 72,
    paddingBottom: 40,
    marginBottom: 20,
    marginHorizontal: -20,
    marginTop: -20,
    paddingHorizontal: 20,
    backgroundColor: '#2d1650',
    borderBottomWidth: 2,
    borderBottomColor: '#d4a843',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  dividerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});
