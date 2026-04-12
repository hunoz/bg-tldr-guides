import React, { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import i18n, { t } from 'i18next';
import { useRouter } from 'expo-router';
import { useSideNavStore, NavItem } from '../stores/sidenav';
import { useTheme } from '../hooks/useTheme';
import { ExternalLink } from './ExternalLink';
import { gameIds } from '../i18n/index';

const DRAWER_WIDTH = 280;
const SUPPORTED_LOCALES = ['en', 'es-MX'];

const LOCALE_META: Record<string, { flag: string; label: string }> = {
  'en': { flag: '🇺🇸', label: 'English' },
  'es-MX': { flag: '🇲🇽', label: 'Español (MX)' },
};

/**
 * Resolve the detected locale to the closest supported locale.
 * e.g. 'en-US' → 'en', 'es-MX' → 'es-MX', 'es' → 'en' (fallback)
 */
function resolveLocale(detected: string): string {
  if (SUPPORTED_LOCALES.includes(detected)) return detected;
  const base = detected.split('-')[0];
  const match = SUPPORTED_LOCALES.find((l) => l === base || l.startsWith(base + '-'));
  return match ?? 'en';
}

/** Build a sorted game list using i18n titles. */
function getSortedGames() {
  return [...gameIds]
    .map((id) => ({
      id,
      icon: t('app.icon', { ns: id }),
      title: t('app.title', { ns: id }),
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Slide-out navigation drawer with grouped nav items, language selector,
 * active-item highlighting, and a GitHub footer link.
 *
 * When on a game page, an "All Games" button appears at the top. Pressing it
 * replaces the section list with an alphabetical game list. Pressing the
 * current game in that list restores the section view without navigating.
 */
export function SideNav() {
  const {
    groups, activeId, isOpen, toggle, close,
    currentGameId, showingGameList, setShowingGameList,
  } = useSideNavStore();
  const theme = useTheme();
  const router = useRouter();
  const translateX = useMemo(() => new Animated.Value(-DRAWER_WIDTH), []);
  const backdropOpacity = useMemo(() => new Animated.Value(0), []);
  const [localePickerOpen, setLocalePickerOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(() => resolveLocale(i18n.language || 'en'));

  const handleToggle = () => {
    if (isOpen) setLocalePickerOpen(false);
    toggle();
  };

  const handleClose = () => {
    setLocalePickerOpen(false);
    close();
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: isOpen ? 0 : -DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: isOpen ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen, translateX, backdropOpacity]);

  const handleLocaleChange = (locale: string) => {
    i18n.changeLanguage(locale);
    setCurrentLocale(locale);
    setLocalePickerOpen(false);
  };

  const handleItemPress = (item: NavItem) => {
    if (item.onSelect) {
      item.onSelect();
    }
    handleClose();
  };

  const handleAllGamesPress = () => {
    setShowingGameList(!showingGameList);
  };

  const handleGamePress = (gameId: string) => {
    if (gameId === currentGameId) {
      // Already on this game — just switch back to sections view
      setShowingGameList(false);
    } else {
      router.push(`/${gameId}` as never);
      handleClose();
    }
  };

  const screenHeight = Dimensions.get('window').height;
  const sortedGames = useMemo(() => getSortedGames(), [currentLocale]);

  return (
    <>
      {/* Toggle button — always visible at top-left */}
      <Pressable
        onPress={handleToggle}
        style={[
          styles.toggleButton,
          { backgroundColor: theme.colors.card + 'DD' },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Toggle navigation menu"
      >
        <Text style={[styles.toggleIcon, { color: theme.colors.text }]}>
          ☰
        </Text>
      </Pressable>

      {/* Backdrop overlay */}
      {isOpen && (
        <TouchableWithoutFeedback onPress={handleClose} accessibilityRole="none">
          <Animated.View
            style={[
              styles.backdrop,
              { height: screenHeight, opacity: backdropOpacity },
            ]}
          />
        </TouchableWithoutFeedback>
      )}

      {/* Drawer panel */}
      <Animated.View
        style={[
          styles.drawer,
          {
            height: screenHeight,
            backgroundColor: theme.colors.card,
            transform: [{ translateX }],
          },
        ]}
      >
        <ScrollView
          style={styles.drawerScroll}
          contentContainerStyle={styles.drawerContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Language selector — keyed on isOpen to reset when drawer reopens */}
          <View style={styles.languageWrapper} key={isOpen ? 'open' : 'closed'}>
            <View style={styles.languageRow}>
              <View style={{ flex: 1 }} />
              <Pressable
                onPress={() => setLocalePickerOpen(!localePickerOpen)}
                style={[
                  styles.languageButton,
                  { borderColor: theme.colors.textMuted + '60' },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Change language"
              >
                <Text style={[styles.languageText, { color: theme.colors.text }]}>
                  {LOCALE_META[currentLocale]?.flag ?? '🌐'} {LOCALE_META[currentLocale]?.label ?? currentLocale} ▾
                </Text>
              </Pressable>
            </View>

            {localePickerOpen && (
              <View
                style={[
                  styles.localePicker,
                  {
                    backgroundColor: '#1a1a2e',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                  },
                ]}
              >
                {SUPPORTED_LOCALES.map((locale) => (
                  <Pressable
                    key={locale}
                    onPress={() => handleLocaleChange(locale)}
                    style={[
                      styles.localeOption,
                      currentLocale === locale && {
                        backgroundColor: theme.colors.accent + '30',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.localeOptionText,
                        { color: '#e0e0e0' },
                        currentLocale === locale && {
                          color: theme.colors.accent,
                          fontWeight: '600',
                        },
                      ]}
                    >
                      {LOCALE_META[locale]?.flag ?? '🌐'} {LOCALE_META[locale]?.label ?? locale}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* "All Games" toggle — only shown on game pages */}
          {currentGameId && (
            <Pressable
              onPress={handleAllGamesPress}
              style={[
                styles.navItem,
                showingGameList && {
                  backgroundColor: theme.colors.accent + '25',
                  borderLeftColor: theme.colors.accent,
                  borderLeftWidth: 3,
                },
              ]}
              accessibilityRole="button"
            >
              <Text style={[styles.navItemIcon, { color: theme.colors.text }]}>
                {showingGameList ? '←' : '🎲'}
              </Text>
              <Text style={[styles.navItemLabel, { color: theme.colors.text }]}>
                {showingGameList
                  ? t('app.title', { ns: currentGameId })
                  : t('common:all-games')}
              </Text>
            </Pressable>
          )}

          {/* Conditional content: game list OR section groups */}
          {currentGameId && showingGameList ? (
            <View style={styles.group}>
              <Text
                style={[styles.groupTitle, { color: theme.colors.textMuted }]}
              >
                {t('common:games')}
              </Text>
              {sortedGames.map((game) => {
                const isCurrent = game.id === currentGameId;
                return (
                  <Pressable
                    key={game.id}
                    onPress={() => handleGamePress(game.id)}
                    style={[
                      styles.navItem,
                      isCurrent && {
                        backgroundColor: theme.colors.accent + '25',
                        borderLeftColor: theme.colors.accent,
                        borderLeftWidth: 3,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isCurrent }}
                  >
                    <Text style={[styles.navItemIcon, { color: theme.colors.text }]}>
                      {game.icon}
                    </Text>
                    <Text
                      style={[
                        styles.navItemLabel,
                        { color: theme.colors.text },
                        isCurrent && {
                          color: theme.colors.accent,
                          fontWeight: '600',
                        },
                      ]}
                      numberOfLines={2}
                    >
                      {game.title}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            /* Section groups (default view, also used on home) */
            groups.map((group, groupIndex) => (
              <View key={group.title ?? `group-${groupIndex}`} style={styles.group}>
                {group.title ? (
                  <Text
                    style={[
                      styles.groupTitle,
                      { color: theme.colors.textMuted },
                    ]}
                  >
                    {group.title}
                  </Text>
                ) : null}
                {group.items.map((item) => {
                  const isActive = item.id === activeId;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => handleItemPress(item)}
                      style={[
                        styles.navItem,
                        isActive && {
                          backgroundColor: theme.colors.accent + '25',
                          borderLeftColor: theme.colors.accent,
                          borderLeftWidth: 3,
                        },
                      ]}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isActive }}
                    >
                      {item.icon ? (
                        <Text style={[styles.navItemIcon, { color: theme.colors.text }]}>{item.icon}</Text>
                      ) : null}
                      <Text
                        style={[
                          styles.navItemLabel,
                          { color: theme.colors.text },
                          isActive && {
                            color: theme.colors.accent,
                            fontWeight: '600',
                          },
                        ]}
                        numberOfLines={2}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ))
          )}
        </ScrollView>

        {/* Footer with GitHub link */}
        <View
          style={[
            styles.footer,
            { borderTopColor: theme.colors.textMuted + '30' },
          ]}
        >
          <ExternalLink href="https://github.com/hunoz/rulesnap">
            <Text style={[styles.footerText, { color: theme.colors.textMuted }]}>
              GitHub
            </Text>
          </ExternalLink>
        </View>
      </Animated.View>
    </>
  );
}


const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 16,
    left: 12,
    zIndex: 100,
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' } as never,
      default: {},
    }),
  },
  toggleIcon: {
    fontSize: 22,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 200,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DRAWER_WIDTH,
    zIndex: 300,
    ...Platform.select({
      web: {
        boxShadow: '2px 0 12px rgba(0,0,0,0.3)',
      } as never,
      default: {
        elevation: 16,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
  },
  drawerScroll: {
    flex: 1,
  },
  drawerContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 24,
    paddingBottom: 16,
  },
  languageWrapper: {
    position: 'relative',
    zIndex: 10,
    marginBottom: 12,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  languageButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  languageText: {
    fontSize: 13,
  },
  localePicker: {
    position: 'absolute',
    top: '100%',
    right: 16,
    width: 120,
    borderRadius: 6,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      } as never,
      default: {
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
    }),
  },
  localeOption: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  localeOptionText: {
    fontSize: 14,
  },
  group: {
    marginBottom: 8,
  },
  groupTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  navItemIcon: {
    fontSize: 16,
    marginRight: 10,
    width: 22,
    textAlign: 'center',
  },
  navItemLabel: {
    fontSize: 14,
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  footerText: {
    fontSize: 13,
  },
});
