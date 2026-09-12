/** Public site constants — not env-driven. */

export const SITE_URL = 'https://nodiworks.com';
export const YOUTUBE_URL = 'https://www.youtube.com/@nodiworks';
export const THREADS_URL = 'https://www.threads.net/@nodiworks';
export const CONTACT_EMAIL = 'contact@cascades.studio';
export const OPERATOR = 'Cascades';

export function getBusinessLines(): string[] {
  // 사업자등록 전: 대표·사업자등록번호 줄은 노출하지 않음
  return [`문의 ${CONTACT_EMAIL}`];
}

export function getSocialLinks(): { label: string; href: string; icon: string }[] {
  return [
    { label: 'YouTube', href: YOUTUBE_URL, icon: 'youtube' },
    { label: 'Threads', href: THREADS_URL, icon: 'at-sign' },
  ];
}

export function getYoutubeUrl(): string {
  return YOUTUBE_URL;
}
