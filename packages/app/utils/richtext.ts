/**
 * AST node representing parsed rich text content.
 * - 'text' nodes hold plain string content
 * - 'element' nodes represent HTML-like tags with optional children
 */
export type SpanNode =
    | { type: 'text'; text: string }
    | {
          type: 'element';
          tag: 'strong' | 'em' | 'span' | 'br';
          className?: string;
          selfClosing?: boolean;
          children: SpanNode[];
      };

/**
 * Parse an HTML-like rich text string into a SpanNode tree.
 * Supports <strong>, <em>, <span>, <br>, and <br/> tags.
 * Handles className attributes on span tags.
 * Unrecognized or malformed tags are treated as plain text.
 */
export function parseRichText(input: string): SpanNode[] {
    const root: SpanNode[] = [];
    const stack: Array<{
        tag: 'strong' | 'em' | 'span' | 'br';
        className?: string;
        children: SpanNode[];
    }> = [];
    let i = 0;
    let textStart = 0;

    function currentChildren(): SpanNode[] {
        return stack.length > 0 ? stack[stack.length - 1].children : root;
    }

    function flushText(end: number): void {
        if (end > textStart) {
            currentChildren().push({ type: 'text', text: input.slice(textStart, end) });
        }
    }

    while (i < input.length) {
        if (input[i] === '<') {
            flushText(i);

            // Check for closing tag
            if (input[i + 1] === '/') {
                const closeEnd = input.indexOf('>', i);
                if (closeEnd === -1) {
                    textStart = i;
                    i++;
                    continue;
                }
                const closeTag = input.slice(i + 2, closeEnd).trim();
                if (stack.length > 0 && stack[stack.length - 1].tag === closeTag) {
                    const node = stack.pop()!;
                    const element: SpanNode = {
                        type: 'element',
                        tag: node.tag,
                        ...(node.className ? { className: node.className } : {}),
                        children: node.children,
                    };
                    currentChildren().push(element);
                }
                i = closeEnd + 1;
                textStart = i;
                continue;
            }

            const brSelfClose = input.slice(i).match(/^<br\s*\/>/);
            if (brSelfClose) {
                currentChildren().push({
                    type: 'element',
                    tag: 'br',
                    selfClosing: true,
                    children: [],
                });
                i += brSelfClose[0].length;
                textStart = i;
                continue;
            }
            const brVoid = input.slice(i).match(/^<br\s*>/);
            if (brVoid) {
                currentChildren().push({
                    type: 'element',
                    tag: 'br',
                    children: [],
                });
                i += brVoid[0].length;
                textStart = i;
                continue;
            }

            const openMatch = input.slice(i).match(/^<(strong|em|span)(\s[^>]*)?>/);
            if (openMatch) {
                const tag = openMatch[1] as 'strong' | 'em' | 'span';
                const attrStr = openMatch[2] || '';
                let className: string | undefined;

                const classMatch = attrStr.match(/className=['"](.*?)['"]/);
                if (classMatch) {
                    className = classMatch[1];
                }

                stack.push({ tag, className, children: [] });
                i += openMatch[0].length;
                textStart = i;
                continue;
            }

            textStart = i;
            i++;
        } else {
            i++;
        }
    }

    flushText(i);

    while (stack.length > 0) {
        const node = stack.pop()!;
        const element: SpanNode = {
            type: 'element',
            tag: node.tag,
            ...(node.className ? { className: node.className } : {}),
            children: node.children,
        };
        currentChildren().push(element);
    }

    return root;
}

/**
 * Serialize a SpanNode tree back to an HTML-like string.
 * Round-trips with parseRichText for supported tag structures.
 */
export function serializeRichText(nodes: SpanNode[]): string {
    let result = '';
    for (const node of nodes) {
        if (node.type === 'text') {
            result += node.text;
        } else {
            if (node.tag === 'br') {
                result += node.selfClosing ? '<br/>' : '<br>';
            } else {
                const classAttr = node.className ? ` className='${node.className}'` : '';
                result += `<${node.tag}${classAttr}>`;
                result += serializeRichText(node.children);
                result += `</${node.tag}>`;
            }
        }
    }
    return result;
}
