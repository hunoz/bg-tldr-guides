import React from 'react';
import { Text, View, TextStyle, StyleProp } from 'react-native';
import { parseRichText } from '../utils/richtext';
import type { SpanNode } from '../utils/richtext';

/** Maps token class names to their display colors. */
const tokenColors: Record<string, string> = {
  'qk-token-white':  '#f0ece0',
  'qk-token-orange': '#d4772c',
  'qk-token-green':  '#5a9e4b',
  'qk-token-blue':   '#4a7fb5',
  'qk-token-red':    '#c0392b',
  'qk-token-yellow': '#d4b82c',
  'qk-token-purple': '#8e44ad',
  'qk-token-black':  '#2c2c2c',
};

/** Maps className values to text styles (color + weight). */
const classStyles: Record<string, TextStyle> = {
  'qk-fortune-purple': { color: '#c39bd3', fontWeight: '600' },
  'qk-fortune-blue':   { color: '#7fb3d8', fontWeight: '600' },
};

/** Style mapping for supported tags. */
const tagStyles: Record<string, TextStyle> = {
  strong: { fontWeight: 'bold' },
  em: { fontStyle: 'italic' },
};

function getTokenColor(className?: string): string | undefined {
  if (!className) return undefined;
  const classes = className.split(/\s+/);
  for (const cls of classes) {
    if (tokenColors[cls]) return tokenColors[cls];
  }
  return undefined;
}

function getClassStyle(className?: string): TextStyle {
  if (!className) return {};
  const classes = className.split(/\s+/);
  for (const cls of classes) {
    if (classStyles[cls]) return classStyles[cls];
  }
  return {};
}

function renderNodes(
  nodes: SpanNode[],
  inheritedStyle: TextStyle,
  keyPrefix: string,
): React.ReactNode[] {
  return nodes.map((node, idx) => {
    const key = `${keyPrefix}-${idx}`;

    if (node.type === 'text') {
      return (
        <Text key={key} style={inheritedStyle}>
          {node.text}
        </Text>
      );
    }

    if (node.tag === 'br') {
      return <Text key={key}>{'\n'}</Text>;
    }

    const tokenColor = getTokenColor(node.className);
    if (tokenColor && node.className?.includes('qk-token')) {
      return (
        <View
          key={key}
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: tokenColor,
          }}
        />
      );
    }

    const classStyle = getClassStyle(node.className);
    const nodeStyle: TextStyle = {
      ...inheritedStyle,
      ...(tagStyles[node.tag] || {}),
      ...classStyle,
    };

    return (
      <Text key={key} style={nodeStyle}>
        {renderNodes(node.children, nodeStyle, key)}
      </Text>
    );
  });
}

/**
 * Renders an HTML-like rich text string as styled React Native Text elements.
 */
export function RichText({
  value,
  style,
}: {
  value: string;
  style?: StyleProp<TextStyle>;
}): React.ReactElement {
  const nodes = parseRichText(value);
  const baseStyle: TextStyle = style ? (style as TextStyle) : {};

  return (
    <Text style={baseStyle}>
      {renderNodes(nodes, baseStyle, 'rt')}
    </Text>
  );
}
