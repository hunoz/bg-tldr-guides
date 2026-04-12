import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSideNavStore } from '../stores/sidenav';
import { gameIds } from '../games/registry';
import Dice from '../assets/images/dice.svg';

export default function HomeScreen() {
    const { t, i18n: i18nInstance } = useTranslation('common');
    const router = useRouter();
    const { setGroups } = useSideNavStore();
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (Platform.OS === 'web') {
            document.title = 'Rule Snap';
        }
    }, []);

    useEffect(() => {
        setGroups([
            {
                title: t('games'),
                items: gameIds.map(id => ({
                    id,
                    label: t('app.title', { ns: id }),
                    icon: t('app.icon', { ns: id }),
                    onSelect: () => router.push(`/${id}` as never),
                })),
            },
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18nInstance.language]);

    const features = [
        { icon: '⚡', titleKey: 'home-feature-setup', descKey: 'home-feature-setup-desc' },
        { icon: '📋', titleKey: 'home-feature-play', descKey: 'home-feature-play-desc' },
        { icon: '🏆', titleKey: 'home-feature-scoring', descKey: 'home-feature-scoring-desc' },
    ];

    const filteredGameIds = gameIds.filter(id => {
        if (!search.trim()) return true;
        const title = t('app.title', { ns: id }).toLowerCase();
        return title.includes(search.trim().toLowerCase());
    });

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Hero Section */}
            <View style={styles.hero}>
                <Text style={styles.heroIcon}>
                    <Dice width={120} height={120} />
                </Text>
                <Text style={styles.heroTitle}>{t('title')}</Text>
                <Text style={styles.heroSubtitle}>{t('home-subtitle')}</Text>
            </View>

            {/* Disclaimer Banner */}
            <View style={styles.disclaimer}>
                <Text style={styles.disclaimerIcon}>📖</Text>
                <Text style={styles.disclaimerText}>{t('home-disclaimer')}</Text>
            </View>

            {/* Feature Cards */}
            <View style={styles.featureRow}>
                {features.map(f => (
                    <View key={f.titleKey} style={styles.featureCard}>
                        <Text style={styles.featureIcon}>{f.icon}</Text>
                        <Text style={styles.featureTitle}>{t(f.titleKey)}</Text>
                        <Text style={styles.featureDesc}>{t(f.descKey)}</Text>
                    </View>
                ))}
            </View>

            {/* Game List */}
            <View style={styles.gameList}>
                <Text style={styles.gameListHeading}>{t('available-guides')}</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder={`🔍 ${t('search-games')}`}
                    placeholderTextColor='#6a6880'
                    value={search}
                    onChangeText={setSearch}
                    autoCapitalize='none'
                    autoCorrect={false}
                />
                {filteredGameIds.map(gameId => (
                    <TouchableOpacity
                        key={gameId}
                        style={styles.gameItem}
                        onPress={() => router.push(`/${gameId}` as never)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.gameIcon}>{t('app.icon', { ns: gameId })}</Text>
                        <Text style={styles.gameLabel}>{t('app.title', { ns: gameId })}</Text>
                        <Text style={styles.gameArrow}>→</Text>
                    </TouchableOpacity>
                ))}
                {filteredGameIds.length === 0 && (
                    <Text style={styles.noResults}>{t('noGamesFound')}</Text>
                )}
            </View>

            {/* Call to Action */}
            <Text style={styles.cta}>{t('home-cta')}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
    content: {
        flexGrow: 1,
    },
    hero: {
        alignItems: 'center',
        paddingTop: 96,
        paddingBottom: 64,
        backgroundColor: '#1a1a2e',
    },
    heroIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
        color: '#f0f0f0',
        letterSpacing: 1,
    },
    heroSubtitle: {
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 28,
        paddingHorizontal: 24,
        color: '#a8a5b8',
    },
    disclaimer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: 12,
        padding: 18,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    disclaimerIcon: {
        fontSize: 20,
        marginRight: 12,
        marginTop: 2,
    },
    disclaimerText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 22,
        color: '#c0bdd0',
    },
    featureRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
        marginHorizontal: 16,
        gap: 12,
    },
    featureCard: {
        borderRadius: 12,
        padding: 20,
        minWidth: '30%',
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.07)',
    },
    featureIcon: {
        fontSize: 28,
        marginBottom: 10,
    },
    featureTitle: {
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 6,
        color: '#f0f0f0',
    },
    featureDesc: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
        color: '#9a97ab',
    },
    gameList: {
        marginBottom: 24,
        marginHorizontal: 16,
        gap: 10,
    },
    gameListHeading: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        color: '#7a7890',
        marginBottom: 10,
    },
    searchInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 15,
        color: '#e8e6f0',
        marginBottom: 12,
    },
    noResults: {
        fontSize: 14,
        color: '#6a6880',
        textAlign: 'center',
        paddingVertical: 16,
        fontStyle: 'italic',
    },
    gameItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.07)',
    },
    gameIcon: {
        fontSize: 28,
        marginRight: 14,
    },
    gameLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#e8e6f0',
    },
    gameArrow: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5a5870',
    },
    cta: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 16,
        marginBottom: 40,
        color: '#6a6880',
        fontStyle: 'italic',
    },
});
