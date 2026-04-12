export interface HeroStyle {
    /** Title text color (overrides theme.colors.accent) */
    titleColor?: string;
    /** Subtitle text color (overrides theme.colors.textMuted) */
    subtitleColor?: string;
    /** Border bottom color */
    borderBottomColor?: string;
    /** Border bottom width */
    borderBottomWidth?: number;
    /** Title letter spacing */
    titleLetterSpacing?: number;
    /** Subtitle font style */
    subtitleFontStyle?: 'normal' | 'italic';
    /** Bottom padding for the hero area */
    paddingBottom?: number;
    /** Top margin for the button row */
    buttonMarginTop?: number;
}

export interface GameConfig {
    /** Unique identifier, used as URL slug and i18n namespace */
    id: string;
    /** Section identifiers in display order */
    sections: string[];
    /** Hero/header background color */
    headerColor: string;
    /** BoardGameGeek URL */
    bggUrl: string;
    /** Manual PDF URL */
    manualUrl?: string;
    /** Map of section ID to lazy-loadable component */
    sectionComponents: Record<string, () => Promise<{ default: React.ComponentType }>>;
    /** i18n key for the subtitle (defaults to 'app.subtitle') */
    subtitleKey?: string;
    /** Per-game hero banner style overrides */
    heroStyle?: HeroStyle;
    /** Custom sidenav label resolver: maps section ID to a translation key, or null to use a formatted fallback */
    sectionNavLabels?: Record<string, string | null>;
}
