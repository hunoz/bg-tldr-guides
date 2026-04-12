/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Minimal mock of react-native for Jest tests.
 * Provides stub implementations of Text, View, and style types
 * so that parser/serializer logic can be tested without a full RN runtime.
 */
import React from 'react';

export const Text = (props: any) => React.createElement('Text', props, props.children);

export const View = (props: any) => React.createElement('View', props, props.children);

export const Pressable = (props: any) => React.createElement('Pressable', props, props.children);

export const Platform = {
    OS: 'ios' as string,
};

export const Linking = {
    openURL: jest.fn(() => Promise.resolve()),
};

export type TextStyle = Record<string, unknown>;
export type ViewStyle = Record<string, unknown>;
export type StyleProp<T> = T | T[] | undefined;

export const StyleSheet = {
    create: <T extends Record<string, any>>(styles: T): T => styles,
};
