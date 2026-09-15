import Link from 'next/link';
import { SUBSCRIBE_CONSENT_DETAIL, PRIVACY_LINK_LABEL } from '../lib/copy';

/** PLAN §3.7 — consent detail + privacy policy link. */
export function SubscribeConsentDetail() {
  return (
    <>
      {SUBSCRIBE_CONSENT_DETAIL}{' '}
      <Link href="/privacy" className="text-link hover:text-link-hover underline">
        {PRIVACY_LINK_LABEL}
      </Link>
    </>
  );
}
