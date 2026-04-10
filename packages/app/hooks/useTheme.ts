import { useContext } from 'react';
import { Theme } from '../theme/themes';
import { ThemeContext } from '../theme/ThemeContext';

export function useTheme(): Theme {
  return useContext(ThemeContext).theme;
}
