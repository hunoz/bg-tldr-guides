import { Trans } from 'react-i18next';
import type { FlatNamespace, ParseKeys } from 'i18next';

type TransWithHtmlProps<N extends FlatNamespace> = {
    ns: N;
    i18nKey: ParseKeys<N>;
};

const HTML_COMPONENTS = {
    strong: <strong />,
    em: <em />,
    span: <span />,
    br: <br />,
};

export default function TransWithHtml<N extends FlatNamespace>({
    ns,
    i18nKey,
}: TransWithHtmlProps<N>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <Trans ns={ns} i18nKey={i18nKey as any} components={HTML_COMPONENTS} />;
}
