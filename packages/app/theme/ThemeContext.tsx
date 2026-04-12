import React, { createContext, useMemo } from 'react';
import { usePathname } from 'expo-router';
import { Theme, homeTheme } from './themes';
import { themeMap } from './themeMap';

interface ThemeContextValue {
    theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: homeTheme });

export { ThemeContext };

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Extract the first path segment: '/castles-of-burgundy' → 'castles-of-burgundy', '/' → ''
    const segment = pathname.split('/').filter(Boolean)[0] ?? '';
    const theme = useMemo(() => themeMap[segment] ?? homeTheme, [segment]);
    return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
}
