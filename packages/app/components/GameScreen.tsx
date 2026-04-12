import React, { Suspense, useEffect, useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { useSideNavStore } from '../stores/sidenav';
import { useScrollTracker } from '../hooks/useScrollTracker';
import { ThemedLinkButton } from './ThemedLinkButton';
import { SectionErrorBoundary } from './SectionErrorBoundary';
import type { GameConfig } from '@/types/GameConfig';

interface GameScreenProps {
    config: GameConfig;
}

/**
 * Generic game screen that renders any game's scrollable guide
 * based on a GameConfig object. Handles hero banner, lazy-loaded
 * sections, scroll tracking, and SideNav wiring.
 */
export function GameScreen({ config }: GameScreenProps) {
    const common = useTranslation('common');
    const { t, i18n: i18nInstance } = useTranslation(config.id);
    const theme = useTheme();
    const { setGroups, setActiveId, setCurrentGameId, setShowingGameList } = useSideNavStore();
    const { handleScroll, getSectionLayoutHandler, scrollToSection, activeId, scrollViewRef } =
        useScrollTracker(config.sections);

    // Build lazy components once per config
    const lazySections = useMemo(
        () =>
            Object.fromEntries(
                Object.entries(config.sectionComponents).map(([id, loader]) => [
                    id,
                    React.lazy(loader),
                ]),
            ),
        [config.sectionComponents],
    );

    /** Resolve a sidenav label for a section, respecting per-game overrides. */
    const getSectionLabel = (id: string): string => {
        const navLabels = config.sectionNavLabels;
        if (navLabels && id in navLabels) {
            const key = navLabels[id];
            // null means use a formatted fallback from the section ID
            if (key === null) {
                return id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1');
            }
            return t(key);
        }
        // Default: use the standard {sectionId}.sidenav key
        return t(`${id}.sidenav`);
    };

    // Wire up SideNav on mount and refresh labels on language change
    useEffect(() => {
        setCurrentGameId(config.id);
        setShowingGameList(false);
        setGroups([
            {
                items: config.sections.map(id => ({
                    id,
                    label: getSectionLabel(id),
                    sectionId: id,
                    onSelect: () => scrollToSection(id),
                })),
            },
        ]);
        return () => {
            setCurrentGameId(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18nInstance.language]);

    // Sync active section to the SideNav store
    useEffect(() => {
        setActiveId(activeId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeId]);

    const hs = config.heroStyle ?? {};

    return (
        <ScrollView
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            contentContainerStyle={styles.content}
        >
            {/* Hero Banner */}
            <View
                style={[
                    styles.hero,
                    {
                        backgroundColor: config.headerColor,
                        borderBottomColor: hs.borderBottomColor ?? theme.colors.accent,
                        borderBottomWidth: hs.borderBottomWidth ?? 4,
                        paddingBottom: hs.paddingBottom ?? 36,
                    },
                ]}
            >
                <Text style={styles.icon}>{t('app.icon')}</Text>
                <Text
                    style={[
                        styles.title,
                        {
                            color: hs.titleColor ?? theme.colors.accent,
                            fontFamily: theme.fonts.heading,
                            letterSpacing: hs.titleLetterSpacing ?? 0,
                        },
                    ]}
                >
                    {t('app.title')}
                </Text>
                <Text
                    style={[
                        styles.subtitle,
                        {
                            color: hs.subtitleColor ?? theme.colors.textMuted,
                            fontFamily: theme.fonts.body,
                            fontStyle: hs.subtitleFontStyle ?? 'normal',
                        },
                    ]}
                >
                    {t(config.subtitleKey ?? 'app.subtitle')}
                </Text>
                <View
                    style={[
                        styles.heroButtons,
                        {
                            marginTop: hs.buttonMarginTop ?? 4,
                            justifyContent: config.manualUrl ? 'flex-start' : 'center',
                        },
                    ]}
                >
                    <ThemedLinkButton href={config.bggUrl} label={common.t('bggButton')} />
                    {config.manualUrl && (
                        <ThemedLinkButton
                            href={config.manualUrl}
                            label={common.t('manualButton')}
                        />
                    )}
                </View>
            </View>

            {/* Lazy-loaded sections */}
            {config.sections.map(id => {
                const LazySection = lazySections[id];
                return (
                    <View
                        key={id}
                        onLayout={getSectionLayoutHandler(id)}
                        style={{ marginBottom: theme.spacing.sectionMargin }}
                    >
                        <SectionErrorBoundary sectionId={id}>
                            <Suspense fallback={<ActivityIndicator />}>
                                <LazySection />
                            </Suspense>
                        </SectionErrorBoundary>
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
    },
    heroButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    icon: {
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
        marginBottom: 12,
    },
});
