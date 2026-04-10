import React, { createContext, useMemo } from 'react';
import { useSegments } from 'expo-router';
import { Theme, themeMap, homeTheme } from './themes';

interface ThemeContextValue {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: homeTheme });

export { ThemeContext };

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const segment = segments[0] || '';
  const theme = useMemo(() => themeMap[segment] ?? homeTheme, [segment]);
  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}
