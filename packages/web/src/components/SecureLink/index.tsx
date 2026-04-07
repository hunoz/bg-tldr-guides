import { Link, type LinkProps } from '@tanstack/react-router';

export type SecureLinkProps = Omit<LinkProps, 'rel' | 'onFollow' | 'to'> & {
    to: string;
    className?: string | undefined;
};

export default function SecureLink(props: SecureLinkProps) {
    const { to, ...rest } = props;

    return (
        <Link
            className={rest.className}
            to={to as LinkProps['to']}
            {...rest}
            rel='noopener noreferrer'
        >
            {props.children}
        </Link>
    );
}
