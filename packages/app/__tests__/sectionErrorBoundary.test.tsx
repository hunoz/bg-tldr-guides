import React from 'react';
import { SectionErrorBoundary } from '../components/SectionErrorBoundary';

/** Recursively extract all text content from a React element tree. */
function extractText(element: React.ReactNode): string {
    if (typeof element === 'string' || typeof element === 'number') return String(element);
    if (!React.isValidElement(element)) return '';
    const children = React.Children.toArray(element.props.children);
    return children.map(extractText).join('');
}

describe('SectionErrorBoundary', () => {
    it('getDerivedStateFromError returns hasError true', () => {
        const result = SectionErrorBoundary.getDerivedStateFromError();
        expect(result).toEqual({ hasError: true });
    });

    it('renders children when hasError is false', () => {
        const child = React.createElement('span', null, 'Hello');
        const boundary = new SectionErrorBoundary({ sectionId: 'overview', children: child });
        boundary.state = { hasError: false };

        const output = boundary.render();
        expect(output).toBe(child);
    });

    it('renders an error message containing the sectionId when hasError is true', () => {
        const boundary = new SectionErrorBoundary({ sectionId: 'setup', children: null });
        boundary.state = { hasError: true };

        const output = boundary.render() as React.ReactElement;
        expect(output).not.toBeNull();

        const text = extractText(output);
        expect(text).toContain('Failed to load section');
        expect(text).toContain('setup');
    });

    it('displays different section ids correctly', () => {
        const boundary = new SectionErrorBoundary({ sectionId: 'scoring', children: null });
        boundary.state = { hasError: true };

        const output = boundary.render() as React.ReactElement;
        const text = extractText(output);
        expect(text).toContain('scoring');
    });
});
