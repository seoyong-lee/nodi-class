import Link from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

export type SmartLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> & {
  href: string;
  children?: ReactNode;
};

/** Same-origin route paths get client-side navigation; hashes and external URLs do not. */
function isRoutePath(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}

/**
 * Anchor that upgrades in-app route paths to `next/link` so the App Router
 * prefetches them and navigates without a full document load.
 */
export function SmartLink({ href, children, ...rest }: SmartLinkProps) {
  if (!isRoutePath(href) || rest.target === '_blank' || rest.download != null) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
