import '../i18n/index'; // Initialize i18n on app start

import { Slot } from 'expo-router';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import {
    CrimsonText_400Regular,
    CrimsonText_700Bold,
    CrimsonText_400Regular_Italic,
} from '@expo-google-fonts/crimson-text';
import { ThemeProvider } from '../theme/ThemeContext';
import { useTheme } from '../hooks/useTheme';
import { SideNav } from '../components/SideNav';

function ThemedLayout() {
    const theme = useTheme();

    // Load fonts on all platforms via @expo-google-fonts
    const [fontsLoaded, fontError] = useFonts({
        'Cinzel': Cinzel_700Bold,
        'Crimson Text': CrimsonText_400Regular,
        'Crimson Text Bold': CrimsonText_700Bold,
        'Crimson Text Italic': CrimsonText_400Regular_Italic,
    });

    if (!fontsLoaded && !fontError) {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: theme.colors.background,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                edges={['top']}
            >
                <ActivityIndicator size='large' color={theme.colors.accent} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
            <StatusBar barStyle='light-content' />
            <View style={{ flex: 1 }}>
                <Slot />
                <SideNav />
            </View>
        </SafeAreaView>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <ThemedLayout />
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
