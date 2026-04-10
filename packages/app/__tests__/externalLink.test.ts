/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
/**
 * ts-jest diagnostics are disabled for this file because ExternalLink.tsx
 * has a minor type-level incompatibility with the full react-native Pressable
 * typings (StyleProp<ViewStyle | TextStyle> vs StyleProp<ViewStyle>). This
 * does not affect runtime behavior — our mock provides the correct interface.
 *
 * @jest-environment node
 */

import fc from 'fast-check';
import { Linking, Platform } from 'react-native';
import React from 'react';

/**
 * Validates: Requirements 12.1
 *
 * Property 10: ExternalLink passes URL to platform linking API
 *
 * For any valid URL string, the ExternalLink component should invoke the
 * platform's link-opening mechanism with that exact URL string, unmodified.
 */
describe('ExternalLink passes URL to platform linking API', () => {
  let ExternalLink: any;

  beforeAll(() => {
    ExternalLink = require('../components/ExternalLink').ExternalLink;
  });

  beforeEach(() => {
    (Platform as any).OS = 'ios';
    (Linking.openURL as jest.Mock).mockClear();
    (Linking.openURL as jest.Mock).mockResolvedValue(undefined);
  });

  /**
   * Arbitrary that generates random URL-like strings covering a variety of
   * protocols, hosts, paths, query strings, and fragments.
   */
  const urlArb = fc.oneof(
    // Standard https URLs
    fc.webUrl({ withFragments: true, withQueryParameters: true }),
    // Custom scheme URLs (e.g. app deep links)
    fc
      .tuple(
        fc.stringMatching(/^[a-z]{3,8}$/),
        fc.stringMatching(/^[a-z0-9.-]{1,20}$/),
        fc.stringMatching(/^(\/[a-z0-9-]{1,10}){0,3}$/),
      )
      .map(([scheme, host, path]) => `${scheme}://${host}${path}`),
  );

  it('should call Linking.openURL with the exact URL on native platforms', () => {
    fc.assert(
      fc.property(urlArb, (url) => {
        (Linking.openURL as jest.Mock).mockClear();

        // Call the component function directly to get the rendered element tree.
        // On native platforms, ExternalLink renders a Pressable with an onPress handler.
        const element = ExternalLink({
          href: url,
          children: React.createElement('Text', null, 'link'),
        });

        // The native branch returns a Pressable; grab its onPress prop
        const onPress = element.props.onPress;
        expect(onPress).toBeDefined();

        // Simulate pressing the link
        onPress();

        // Assert Linking.openURL was called with the exact, unmodified URL
        expect(Linking.openURL).toHaveBeenCalledTimes(1);
        expect(Linking.openURL).toHaveBeenCalledWith(url);
      }),
      { numRuns: 100 },
    );
  });

  it('should pass the URL unmodified regardless of native platform variant', () => {
    const platformArb = fc.constantFrom('ios', 'android');

    fc.assert(
      fc.property(fc.tuple(platformArb, urlArb), ([platform, url]) => {
        (Platform as any).OS = platform;
        (Linking.openURL as jest.Mock).mockClear();

        const element = ExternalLink({
          href: url,
          children: React.createElement('Text', null, 'link'),
        });

        const onPress = element.props.onPress;
        expect(onPress).toBeDefined();
        onPress();

        expect(Linking.openURL).toHaveBeenCalledWith(url);
      }),
      { numRuns: 100 },
    );
  });
});


/**
 * Unit tests for ExternalLink web rendering.
 *
 * Verifies that on web the component renders a standard anchor element
 * with security attributes (target="_blank", rel="noopener noreferrer").
 */
describe('ExternalLink — web rendering', () => {
  let ExternalLink: any;

  beforeAll(() => {
    ExternalLink = require('../components/ExternalLink').ExternalLink;
  });

  beforeEach(() => {
    (Platform as any).OS = 'web';
  });

  afterEach(() => {
    (Platform as any).OS = 'ios';
  });

  it('should render an <a> element on web', () => {
    const element = ExternalLink({
      href: 'https://example.com',
      children: React.createElement('Text', null, 'Example'),
    });

    expect(element.type).toBe('a');
  });

  it('should set target="_blank" on the anchor', () => {
    const element = ExternalLink({
      href: 'https://example.com',
      children: React.createElement('Text', null, 'link'),
    });

    expect(element.props.target).toBe('_blank');
  });

  it('should set rel="noopener noreferrer" on the anchor', () => {
    const element = ExternalLink({
      href: 'https://boardgamegeek.com/boardgame/271320',
      children: React.createElement('Text', null, 'BGG'),
    });

    expect(element.props.rel).toBe('noopener noreferrer');
  });

  it('should pass the href prop through to the anchor', () => {
    const url = 'https://github.com/hunoz/rulesnap';
    const element = ExternalLink({
      href: url,
      children: React.createElement('Text', null, 'GitHub'),
    });

    expect(element.props.href).toBe(url);
  });

  it('should render children inside the anchor', () => {
    const child = React.createElement('Text', null, 'Click me');
    const element = ExternalLink({
      href: 'https://example.com',
      children: child,
    });

    expect(element.props.children).toBe(child);
  });
});
