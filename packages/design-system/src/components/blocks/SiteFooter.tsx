import { Icon } from '../core/Icon';
import styles from './SiteFooter.module.css';

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
};

export function SiteFooter({
  operator,
  business,
  links,
  socialLinks,
}: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.businessBlock}>
          <span className={styles.operator}>{operator}</span>
          <ul className={styles.businessList}>
            {business.map((line) => (
              <li key={line} className={styles.businessItem}>
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.aside}>
          <ul className={styles.links}>
            {links.map((link) => (
              <li key={link.label}>
                <a className={styles.link} href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <ul className={styles.social}>
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  className={styles.socialLink}
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
          <span className={styles.copy}>
            © {year} {operator}
          </span>
        </div>
      </div>
    </footer>
  );
}
