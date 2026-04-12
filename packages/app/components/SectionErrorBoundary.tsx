import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SectionErrorBoundaryProps {
    children: React.ReactNode;
    sectionId: string;
}

interface SectionErrorBoundaryState {
    hasError: boolean;
}

/**
 * Error boundary that catches render failures in lazy-loaded game sections.
 * Displays an inline error message so the rest of the screen remains usable.
 */
export class SectionErrorBoundary extends React.Component<
    SectionErrorBoundaryProps,
    SectionErrorBoundaryState
> {
    state: SectionErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(): SectionErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error) {
        console.warn(
            `[SectionErrorBoundary] Section "${this.props.sectionId}" failed to render:`,
            error.message,
        );
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.icon}>⚠️</Text>
                    <Text style={styles.message}>
                        Failed to load section: {this.props.sectionId}
                    </Text>
                </View>
            );
        }
        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 80, 80, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255, 80, 80, 0.3)',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    icon: {
        fontSize: 24,
        marginBottom: 6,
    },
    message: {
        color: '#ff6b6b',
        fontSize: 14,
        textAlign: 'center',
    },
});
