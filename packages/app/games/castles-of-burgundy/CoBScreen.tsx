import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { useSideNavStore } from '../../stores/sidenav';
import { useScrollTracker } from '../../hooks/useScrollTracker';
import { ThemedLinkButton } from '../../components/ThemedLinkButton';
import { getManualUrl } from '../../utils/constants';
import { Overview } from './sections/Overview';
import { Setup } from './sections/Setup';
import { GameFlow } from './sections/GameFlow';
import { YourTurn } from './sections/YourTurn';
import { Scoring } from './sections/Scoring';
import { TileTypes } from './sections/TileTypes';
import { Buildings } from './sections/Buildings';
import { Monasteries } from './sections/Monasteries';
import { EndOfGame } from './sections/EndOfGame';

const sectionIds = [
  'overview',
  'setup',
  'gameFlow',
  'yourTurn',
  'scoring',
  'tileTypes',
  'buildings',
  'monasteries',
  'endOfGame',
] as const;

const sectionComponents: Record<string, React.ComponentType> = {
  overview: Overview,
  setup: Setup,
  gameFlow: GameFlow,
  yourTurn: YourTurn,
  scoring: Scoring,
  tileTypes: TileTypes,
  buildings: Buildings,
  monasteries: Monasteries,
  endOfGame: EndOfGame,
};

/**
 * Main Castles of Burgundy game screen.
 * Renders a scrollable guide with hero banner, 9 content sections, and footer.
 */
export function CoBScreen() {
  const common = useTranslation('common');
  const { t, i18n: i18nInstance } = useTranslation('castles-of-burgundy');
  const theme = useTheme();
  const { setGroups, setActiveId, setCurrentGameId, setShowingGameList } = useSideNavStore();
  const {
    handleScroll,
    getSectionLayoutHandler,
    scrollToSection,
    activeId,
    scrollViewRef,
  } = useScrollTracker([...sectionIds]);

  // Set SideNav groups on mount
  useEffect(() => {
    setCurrentGameId('castles-of-burgundy');
    setShowingGameList(false);
    setGroups([
      {
        items: sectionIds.map((id) => ({
          id,
          label: t(`${id}.sidenav`),
          sectionId: id,
          onSelect: () => scrollToSection(id),
        })),
      },
    ]);
    return () => { setCurrentGameId(null); };
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
      {/* Hero Banner */}
      <View style={styles.hero}>
        <Text style={styles.crest}>🏰</Text>
        <Text
          style={[
            styles.heroTitle,
            { fontFamily: theme.fonts.heading },
          ]}
        >
          {t('app.title')}
        </Text>
        <Text
          style={[
            styles.heroSubtitle,
            { fontFamily: theme.fonts.body },
          ]}
        >
          {t('app.subtitle')}
        </Text>
        <View style={styles.heroButtons}>
          <ThemedLinkButton
            href="https://boardgamegeek.com/boardgame/271320/the-castles-of-burgundy"
            label={common.t('bggButton')}
          />
          <ThemedLinkButton
            href={getManualUrl('castles-of-burgundy')}
            label={common.t('manualButton')}
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
  hero: {
    alignItems: 'center',
    paddingTop: 72,
    paddingBottom: 36,
    marginBottom: 20,
    marginHorizontal: -20,
    marginTop: -20,
    paddingHorizontal: 20,
    backgroundColor: '#3e2215',
    borderBottomWidth: 4,
    borderBottomColor: '#c9a84c',
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  crest: {
    fontSize: 48,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    color: '#f0d68a',
    letterSpacing: 3,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    color: '#c9a84c',
    fontStyle: 'italic',
  },
});
