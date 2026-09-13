import type { ReactNode } from 'react';
import { Icon } from '../core/Icon';

export type SiteFooterLink = {
  label: string;
  href: string;
};

export type SiteFooterSocialLink = {
  label: string;
  href: string;
  icon: string;
};

export type SiteFooterProps = {
  operator: string;
  business: string[];
  links: SiteFooterLink[];
  socialLinks: SiteFooterSocialLink[];
  /** Optional trailing control (e.g. theme toggle) at the end of the right column. */
  trailing?: ReactNode;
};

export function SiteFooter({
  operator,
  business,
  links,
  socialLinks,
  trailing,
}: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line pt-block-tight pb-8">
      <div className="max-w-page mx-auto px-gutter flex flex-wrap gap-block justify-between">
        <div className="flex flex-col gap-inline min-w-0">
          <span className="text-body-sm font-bold text-strong">{operator}</span>
          <ul className="list-none m-0 p-0 flex flex-col gap-2">
            {business.map((line) => (
              <li key={line} className="text-label leading-[1.8] text-muted">
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-block-tight items-start">
          <ul className="list-none m-0 p-0 flex gap-block-tight flex-wrap">
            {links.map((link) => (
              <li key={link.label}>
                <a className="text-caption text-body" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <ul className="list-none m-0 p-0 flex gap-inline flex-wrap">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  className="inline-flex items-center gap-[6px] text-caption text-body"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name={link.icon} size={14} />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-inline w-full justify-between">
            <span className="text-label text-disabled">
              © {year} {operator}
            </span>
            {trailing}
          </div>
        </div>
      </div>
    </footer>
  );
}
