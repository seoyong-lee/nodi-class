import Link from 'next/link';
import { PRIVACY_LINK_LABEL, SUBSCRIBE_CONSENT_DETAIL } from '../lib/copy';

/** PLAN §3 consent detail + privacy link under the EmailGate checkbox. */
export function SubscribeConsentDetail() {
  return (
    <>
      {SUBSCRIBE_CONSENT_DETAIL}{' '}
      <Link className="text-link underline-offset-2 hover:underline" href="/privacy">
        {PRIVACY_LINK_LABEL}
      </Link>
    </>
  );
}
