import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';

/**
 * End of Round section — placeholder for end-of-round rules.
 * Translation data is currently empty; renders minimal content
 * with a callout box using left-border accent styling.
 */
export function EndOfRound() {
  const theme = useTheme();

  return (
    <View>
      <Text
        style={[
          styles.heading,
          { color: theme.colors.accent, fontFamily: theme.fonts.heading },
        ]}
      >
        End of Round
      </Text>
      <View
        style={[
          styles.callout,
          {
            borderLeftColor: theme.colors.accent,
            backgroundColor: theme.colors.card,
          },
        ]}
      >
        <Text style={[styles.body, { color: theme.colors.textMuted }]}>
          Content coming soon.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  callout: {
    borderLeftWidth: 4,
    borderRadius: 4,
    padding: 12,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
  },
});
