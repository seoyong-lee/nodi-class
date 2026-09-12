/**
 * Cloudflare Turnstile (execute-on-submit).
 *
 * Widget mode (Managed / Invisible) is set in the Cloudflare dashboard.
 * `size: 'invisible'` was removed from the client API — use execution mode instead.
 *
 * When NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset (local), skip the widget and
 * send `dev-turnstile-token` so forms work without keys — NODE_ENV=development only.
 */

const SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/** Fixed dummy; length >= 10 to satisfy SubscribeInput / InquiryInput. */
export const DEV_TURNSTILE_TOKEN = 'dev-turnstile-token';

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      size?: 'normal' | 'compact' | 'flexible';
      execution?: 'render' | 'execute';
      appearance?: 'always' | 'execute' | 'interaction-only';
      callback?: (token: string) => void;
      'error-callback'?: () => void;
      'expired-callback'?: () => void;
    },
  ) => string;
  execute: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('turnstile: no window'));
  }
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener(
        'error',
        () => reject(new Error('turnstile: script failed')),
        { once: true },
      );
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('turnstile: script failed'));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export async function getTurnstileToken(
  container: HTMLElement,
): Promise<string> {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  if (!siteKey) {
    if (process.env.NODE_ENV === 'development') {
      return DEV_TURNSTILE_TOKEN;
    }
    throw new Error('turnstile: missing site key');
  }

  await loadTurnstileScript();
  const api = window.turnstile;
  if (!api) throw new Error('turnstile: api missing');

  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      fn();
    };

    const widgetId = api.render(container, {
      sitekey: siteKey,
      size: 'normal',
      execution: 'execute',
      appearance: 'interaction-only',
      callback: (token) => {
        finish(() => {
          api.remove(widgetId);
          container.replaceChildren();
          resolve(token);
        });
      },
      'error-callback': () => {
        finish(() => {
          api.remove(widgetId);
          container.replaceChildren();
          reject(new Error('turnstile: challenge failed'));
        });
      },
      'expired-callback': () => {
        finish(() => {
          api.remove(widgetId);
          container.replaceChildren();
          reject(new Error('turnstile: expired'));
        });
      },
    });

    api.execute(widgetId);
  });
}
