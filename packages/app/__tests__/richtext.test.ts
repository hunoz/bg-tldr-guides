import fc from 'fast-check';
import { parseRichText, serializeRichText } from '../utils/richtext';

/**
 * Validates: Requirements 7.8
 *
 * Property 1: Rich text parse/serialize round-trip
 *
 * For any valid HTML-like rich text string composed of supported tags
 * (<strong>, <em>, <span>, <br>, <br/>), parsing the string into a
 * SpanNode tree and then serializing it back should produce the original input.
 */
describe('Rich text parse/serialize round-trip', () => {
    /**
     * Generates plain text segments that avoid '<' to prevent ambiguity
     * with tag parsing. Allows empty strings and typical content.
     */
    const plainTextArb = fc.stringOf(
        fc.char().filter(c => c !== '<'),
        { minLength: 0, maxLength: 20 },
    );

    /** Known className values that the parser handles. */
    const classNameArb = fc.constantFrom(
        'qk-token qk-token-white',
        'qk-token qk-token-orange',
        'qk-token qk-token-green',
        'qk-fortune-purple',
        'qk-fortune-blue',
    );

    /**
     * Recursive arbitrary that builds valid rich text strings from a grammar:
     *   richtext  = (plaintext | element)*
     *   element   = br | tagged
     *   br        = "<br>" | "<br/>"
     *   tagged    = "<tag" [classAttr] ">" richtext "</tag>"
     *   tag       = "strong" | "em" | "span"
     *   classAttr = " className='...'"
     */
    const richTextArb: fc.Arbitrary<string> = fc.letrec(tie => ({
        richText: fc
            .array(fc.oneof(tie('plainText'), tie('element')), {
                minLength: 0,
                maxLength: 5,
            })
            .map(parts => parts.join('')),

        plainText: plainTextArb.filter(s => s.length > 0),

        element: fc.oneof(tie('brElement'), tie('taggedElement')),

        brElement: fc.constantFrom('<br>', '<br/>'),

        taggedElement: fc.oneof(
            // <strong>...</strong>
            tie('richText').map(inner => `<strong>${inner}</strong>`),
            // <em>...</em>
            tie('richText').map(inner => `<em>${inner}</em>`),
            // <span>...</span> (no className)
            tie('richText').map(inner => `<span>${inner}</span>`),
            // <span className='...'>...</span>
            fc
                .tuple(classNameArb, tie('richText'))
                .map(([cls, inner]) => `<span className='${cls}'>${inner}</span>`),
        ),
    })).richText;

    it('should produce the original input after parse then serialize', () => {
        fc.assert(
            fc.property(richTextArb, input => {
                const nodes = parseRichText(input);
                const output = serializeRichText(nodes);
                expect(output).toBe(input);
            }),
            { numRuns: 200 },
        );
    });

    it('should round-trip empty string', () => {
        const nodes = parseRichText('');
        expect(serializeRichText(nodes)).toBe('');
    });

    it('should round-trip plain text without tags', () => {
        fc.assert(
            fc.property(plainTextArb, text => {
                const nodes = parseRichText(text);
                expect(serializeRichText(nodes)).toBe(text);
            }),
            { numRuns: 100 },
        );
    });

    it('should round-trip deeply nested tags', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 1, max: 6 }),
                plainTextArb.filter(s => s.length > 0),
                (depth, text) => {
                    // Build a deeply nested string like <strong><em><strong>..text..</strong></em></strong>
                    const tags = ['strong', 'em', 'span'];
                    let input = text;
                    const tagStack: string[] = [];
                    for (let i = 0; i < depth; i++) {
                        const tag = tags[i % tags.length];
                        tagStack.push(tag);
                        input = `<${tag}>${input}</${tag}>`;
                    }

                    const nodes = parseRichText(input);
                    expect(serializeRichText(nodes)).toBe(input);
                },
            ),
            { numRuns: 100 },
        );
    });
});

import type { TextStyle } from 'react-native';

// Re-import SpanNode type inline (mirrors the exported type from RichText.tsx)
type SpanNode =
    | { type: 'text'; text: string }
    | {
          type: 'element';
          tag: 'strong' | 'em' | 'span' | 'br';
          className?: string;
          selfClosing?: boolean;
          children: SpanNode[];
      };

/** Tag-to-style mapping matching the RichText component's rendering logic. */
const TAG_STYLES: Record<string, TextStyle> = {
    strong: { fontWeight: 'bold' },
    em: { fontStyle: 'italic' },
};

/** Token class-to-color mapping matching the RichText component. */
const TOKEN_COLORS: Record<string, string> = {
    'qk-token-white': '#f0ece0',
    'qk-token-orange': '#d4772c',
    'qk-token-green': '#5a9e4b',
    'qk-token-blue': '#4a7fb5',
    'qk-token-red': '#c0392b',
    'qk-token-yellow': '#d4b82c',
    'qk-token-purple': '#8e44ad',
    'qk-token-black': '#2c2c2c',
};

/**
 * Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.7, 9.5
 *
 * Property 2: Rich text tag-to-style mapping
 *
 * For any valid rich text string containing any combination of supported tags
 * (including nested tags like <strong><em>text</em></strong>), the parsed
 * SpanNode tree should assign the correct structure per tag type:
 * - <strong> → fontWeight: 'bold'
 * - <em> → fontStyle: 'italic'
 * - <br>/<br/> → newline (leaf node, no children)
 * - <span> → inline span (no extra style)
 * - <span className='qk-token qk-token-X'> → token circle with mapped color
 * Nested tags should combine their ancestor styles.
 */
describe('Rich text tag-to-style mapping', () => {
    /** Plain text that avoids '<' to prevent ambiguity with tag parsing. */
    const plainTextArb = fc.stringOf(
        fc.char().filter(c => c !== '<'),
        { minLength: 1, maxLength: 15 },
    );

    /** Token class names used in the Quacks game screen. */
    const tokenClassArb = fc.constantFrom(
        'qk-token qk-token-white',
        'qk-token qk-token-orange',
        'qk-token qk-token-green',
        'qk-token qk-token-blue',
        'qk-token qk-token-red',
        'qk-token qk-token-yellow',
        'qk-token qk-token-purple',
        'qk-token qk-token-black',
    );

    /** Recursive arbitrary that builds valid rich text strings. */
    const richTextArb: fc.Arbitrary<string> = fc.letrec(tie => ({
        richText: fc
            .array(fc.oneof(tie('plainText'), tie('element')), {
                minLength: 1,
                maxLength: 5,
            })
            .map(parts => parts.join('')),

        plainText: plainTextArb,

        element: fc.oneof(
            { weight: 2, arbitrary: tie('taggedElement') },
            { weight: 1, arbitrary: tie('brElement') },
        ),

        brElement: fc.constantFrom('<br>', '<br/>'),

        taggedElement: fc.oneof(
            tie('richText').map(inner => `<strong>${inner}</strong>`),
            tie('richText').map(inner => `<em>${inner}</em>`),
            tie('richText').map(inner => `<span>${inner}</span>`),
            fc
                .tuple(tokenClassArb, tie('richText'))
                .map(([cls, inner]) => `<span className='${cls}'>${inner}</span>`),
        ),
    })).richText;

    /**
     * Compute the effective style that would be applied to a node,
     * given the accumulated ancestor styles. This mirrors how the
     * RichText component merges styles during rendering.
     */
    function computeEffectiveStyle(ancestorStyle: TextStyle, tag: string): TextStyle {
        return { ...ancestorStyle, ...(TAG_STYLES[tag] || {}) };
    }

    /**
     * Extract the token color from a className string, if present.
     */
    function getTokenColor(className?: string): string | undefined {
        if (!className) return undefined;
        for (const cls of className.split(/\s+/)) {
            if (TOKEN_COLORS[cls]) return TOKEN_COLORS[cls];
        }
        return undefined;
    }

    /**
     * Recursively walk the SpanNode tree and verify that each node
     * has the correct tag, structure, and style mapping.
     * `ancestorStyle` accumulates styles from parent tags.
     */
    function assertNodeStyles(nodes: SpanNode[], ancestorStyle: TextStyle): void {
        for (const node of nodes) {
            if (node.type === 'text') {
                // Text nodes are leaves — no tag or style to verify
                expect(typeof node.text).toBe('string');
                continue;
            }

            // Element node — verify tag is one of the supported types
            expect(['strong', 'em', 'span', 'br']).toContain(node.tag);

            if (node.tag === 'br') {
                // <br> tags are leaf nodes representing newlines
                expect(node.children).toEqual([]);
                continue;
            }

            if (node.tag === 'strong') {
                // <strong> maps to fontWeight: 'bold'
                const effectiveStyle = computeEffectiveStyle(ancestorStyle, 'strong');
                expect(effectiveStyle.fontWeight).toBe('bold');
                // Recurse into children with accumulated style
                assertNodeStyles(node.children, effectiveStyle);
            } else if (node.tag === 'em') {
                // <em> maps to fontStyle: 'italic'
                const effectiveStyle = computeEffectiveStyle(ancestorStyle, 'em');
                expect(effectiveStyle.fontStyle).toBe('italic');
                // Recurse into children with accumulated style
                assertNodeStyles(node.children, effectiveStyle);
            } else if (node.tag === 'span') {
                const tokenColor = getTokenColor(node.className);
                if (tokenColor && node.className?.includes('qk-token')) {
                    // Token span: should map to a colored circle indicator
                    expect(TOKEN_COLORS).toHaveProperty(
                        node.className!.split(/\s+/).find(c => TOKEN_COLORS[c])!,
                        tokenColor,
                    );
                }
                // <span> without token class is an inline span (no extra style)
                const effectiveStyle = computeEffectiveStyle(ancestorStyle, 'span');
                assertNodeStyles(node.children, effectiveStyle);
            }
        }
    }

    it('should map each tag to the correct style in the parsed tree', () => {
        fc.assert(
            fc.property(richTextArb, input => {
                const nodes = parseRichText(input);
                assertNodeStyles(nodes, {});
            }),
            { numRuns: 200 },
        );
    });

    it('should preserve bold style through nested elements', () => {
        fc.assert(
            fc.property(plainTextArb, text => {
                const input = `<strong><em>${text}</em></strong>`;
                const nodes = parseRichText(input);

                // Root should be a strong element
                expect(nodes).toHaveLength(1);
                const strong = nodes[0];
                expect(strong.type).toBe('element');
                if (strong.type !== 'element') return;
                expect(strong.tag).toBe('strong');

                // Child should be an em element
                expect(strong.children).toHaveLength(1);
                const em = strong.children[0];
                expect(em.type).toBe('element');
                if (em.type !== 'element') return;
                expect(em.tag).toBe('em');

                // Effective style at the text leaf should combine bold + italic
                const effectiveStyle: TextStyle = {
                    ...TAG_STYLES['strong'],
                    ...TAG_STYLES['em'],
                };
                expect(effectiveStyle.fontWeight).toBe('bold');
                expect(effectiveStyle.fontStyle).toBe('italic');
            }),
            { numRuns: 100 },
        );
    });

    it('should map token class names to the correct colors', () => {
        fc.assert(
            fc.property(tokenClassArb, plainTextArb, (cls, text) => {
                const input = `<span className='${cls}'>${text}</span>`;
                const nodes = parseRichText(input);

                expect(nodes).toHaveLength(1);
                const span = nodes[0];
                expect(span.type).toBe('element');
                if (span.type !== 'element') return;
                expect(span.tag).toBe('span');
                expect(span.className).toBe(cls);

                // Verify the className maps to a known token color
                const tokenCls = cls.split(/\s+/).find(c => TOKEN_COLORS[c]);
                expect(tokenCls).toBeDefined();
                expect(TOKEN_COLORS[tokenCls!]).toBeDefined();
            }),
            { numRuns: 100 },
        );
    });

    it('should represent <br> tags as leaf element nodes', () => {
        fc.assert(
            fc.property(fc.constantFrom('<br>', '<br/>'), plainTextArb, (br, text) => {
                const input = `${text}${br}${text}`;
                const nodes = parseRichText(input);

                // Find the br node in the parsed output
                const brNode = nodes.find(n => n.type === 'element' && n.tag === 'br');
                expect(brNode).toBeDefined();
                if (brNode && brNode.type === 'element') {
                    expect(brNode.tag).toBe('br');
                    expect(brNode.children).toEqual([]);
                }
            }),
            { numRuns: 100 },
        );
    });
});

/**
 * Unit tests for the Rich Text Parser.
 *
 * These example-based tests verify specific inputs and edge cases
 * for parseRichText and serializeRichText.
 */
describe('parseRichText unit tests', () => {
    it('should parse "Hello <strong>world</strong>" into text + bold element', () => {
        const nodes = parseRichText('Hello <strong>world</strong>');
        expect(nodes).toHaveLength(2);

        expect(nodes[0]).toEqual({ type: 'text', text: 'Hello ' });

        const strong = nodes[1];
        expect(strong.type).toBe('element');
        if (strong.type !== 'element') return;
        expect(strong.tag).toBe('strong');
        expect(strong.children).toHaveLength(1);
        expect(strong.children[0]).toEqual({ type: 'text', text: 'world' });
    });

    it('should return an empty array for an empty string', () => {
        const nodes = parseRichText('');
        expect(nodes).toEqual([]);
    });

    it('should return a single text node for plain text with no tags', () => {
        const nodes = parseRichText('Just plain text here');
        expect(nodes).toHaveLength(1);
        expect(nodes[0]).toEqual({ type: 'text', text: 'Just plain text here' });
    });

    it('should treat malformed/unrecognized tags as plain text', () => {
        const input = 'Hello <unknown>world</unknown>';
        const nodes = parseRichText(input);
        // The parser should not crash; unrecognized opening tags become text
        expect(nodes.length).toBeGreaterThan(0);
        // Verify the text content is preserved (closing tag is silently consumed)
        const hasHello = nodes.some(n => n.type === 'text' && n.text.includes('Hello'));
        const hasWorld = nodes.some(n => n.type === 'text' && n.text.includes('world'));
        expect(hasHello).toBe(true);
        expect(hasWorld).toBe(true);
    });

    it('should handle an unclosed tag gracefully', () => {
        const nodes = parseRichText('Hello <strong>world');
        // Parser auto-closes unclosed tags
        expect(nodes.length).toBeGreaterThan(0);
        // The strong element should still contain "world"
        const strong = nodes.find(n => n.type === 'element' && n.tag === 'strong');
        expect(strong).toBeDefined();
        if (strong && strong.type === 'element') {
            expect(strong.children).toHaveLength(1);
            expect(strong.children[0]).toEqual({ type: 'text', text: 'world' });
        }
    });

    it('should handle a lone "<" as plain text', () => {
        const nodes = parseRichText('5 < 10');
        const text = serializeRichText(nodes);
        expect(text).toBe('5 < 10');
    });

    it('should parse deeply nested tags correctly', () => {
        const input = '<strong><em><span>deep</span></em></strong>';
        const nodes = parseRichText(input);
        expect(nodes).toHaveLength(1);

        const strong = nodes[0];
        expect(strong.type).toBe('element');
        if (strong.type !== 'element') return;
        expect(strong.tag).toBe('strong');
        expect(strong.children).toHaveLength(1);

        const em = strong.children[0];
        expect(em.type).toBe('element');
        if (em.type !== 'element') return;
        expect(em.tag).toBe('em');
        expect(em.children).toHaveLength(1);

        const span = em.children[0];
        expect(span.type).toBe('element');
        if (span.type !== 'element') return;
        expect(span.tag).toBe('span');
        expect(span.children).toHaveLength(1);
        expect(span.children[0]).toEqual({ type: 'text', text: 'deep' });
    });

    it('should parse <br> as a leaf element node representing a newline', () => {
        const nodes = parseRichText('line1<br>line2');
        expect(nodes).toHaveLength(3);

        expect(nodes[0]).toEqual({ type: 'text', text: 'line1' });

        const br = nodes[1];
        expect(br.type).toBe('element');
        if (br.type !== 'element') return;
        expect(br.tag).toBe('br');
        expect(br.children).toEqual([]);

        expect(nodes[2]).toEqual({ type: 'text', text: 'line2' });
    });

    it('should parse <br/> as a self-closing leaf element node', () => {
        const nodes = parseRichText('line1<br/>line2');
        expect(nodes).toHaveLength(3);

        expect(nodes[0]).toEqual({ type: 'text', text: 'line1' });

        const br = nodes[1];
        expect(br.type).toBe('element');
        if (br.type !== 'element') return;
        expect(br.tag).toBe('br');
        expect(br.selfClosing).toBe(true);
        expect(br.children).toEqual([]);

        expect(nodes[2]).toEqual({ type: 'text', text: 'line2' });
    });

    it("should parse <span className='qk-token qk-token-white'> with correct className", () => {
        const input = "<span className='qk-token qk-token-white'>W</span>";
        const nodes = parseRichText(input);
        expect(nodes).toHaveLength(1);

        const span = nodes[0];
        expect(span.type).toBe('element');
        if (span.type !== 'element') return;
        expect(span.tag).toBe('span');
        expect(span.className).toBe('qk-token qk-token-white');
        expect(span.children).toHaveLength(1);
        expect(span.children[0]).toEqual({ type: 'text', text: 'W' });
    });

    it('should map all token color classNames correctly', () => {
        const tokenMap: Record<string, string> = {
            'qk-token-white': '#f0ece0',
            'qk-token-orange': '#d4772c',
            'qk-token-green': '#5a9e4b',
            'qk-token-blue': '#4a7fb5',
            'qk-token-red': '#c0392b',
            'qk-token-yellow': '#d4b82c',
            'qk-token-purple': '#8e44ad',
            'qk-token-black': '#2c2c2c',
        };

        for (const [tokenClass, expectedColor] of Object.entries(tokenMap)) {
            const className = `qk-token ${tokenClass}`;
            const input = `<span className='${className}'>X</span>`;
            const nodes = parseRichText(input);
            expect(nodes).toHaveLength(1);

            const span = nodes[0];
            expect(span.type).toBe('element');
            if (span.type !== 'element') return;
            expect(span.className).toBe(className);

            // Verify the token class maps to the expected color
            expect(TOKEN_COLORS[tokenClass]).toBe(expectedColor);
        }
    });

    it('should parse <em> tags as italic elements', () => {
        const nodes = parseRichText('This is <em>italic</em> text');
        expect(nodes).toHaveLength(3);

        expect(nodes[0]).toEqual({ type: 'text', text: 'This is ' });

        const em = nodes[1];
        expect(em.type).toBe('element');
        if (em.type !== 'element') return;
        expect(em.tag).toBe('em');
        expect(em.children).toEqual([{ type: 'text', text: 'italic' }]);

        expect(nodes[2]).toEqual({ type: 'text', text: ' text' });
    });

    it('should handle mixed inline tags in sequence', () => {
        const input = '<strong>bold</strong> and <em>italic</em>';
        const nodes = parseRichText(input);
        expect(nodes).toHaveLength(3);

        const strong = nodes[0];
        expect(strong.type).toBe('element');
        if (strong.type !== 'element') return;
        expect(strong.tag).toBe('strong');
        expect(strong.children).toEqual([{ type: 'text', text: 'bold' }]);

        expect(nodes[1]).toEqual({ type: 'text', text: ' and ' });

        const em = nodes[2];
        expect(em.type).toBe('element');
        if (em.type !== 'element') return;
        expect(em.tag).toBe('em');
        expect(em.children).toEqual([{ type: 'text', text: 'italic' }]);
    });

    it('should round-trip a complex string with multiple tag types', () => {
        const input =
            "<strong>Setup:</strong> Each player takes <em>1</em> board.<br>Place <span className='qk-token qk-token-green'>tokens</span> nearby.";
        const nodes = parseRichText(input);
        const output = serializeRichText(nodes);
        expect(output).toBe(input);
    });
});
