import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useLocalSearchParams, Redirect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { getGameById } from '../games/registry';
import { GameScreen } from '../components/GameScreen';

export default function GameRoute() {
    const { gameId } = useLocalSearchParams<{ gameId: string }>();
    const config = getGameById(gameId);
    const { t } = useTranslation(config?.id);

    useEffect(() => {
        if (Platform.OS === 'web' && config) {
            document.title = `${t('app.title')} Play Guide`;
        }
    }, [config, t]);

    if (!config) return <Redirect href='/' />;

    return <GameScreen config={config} />;
}
