export const COOKIE_NAME = 'nodi_access';
export const CONFIRM_TTL_SEC = 7 * 24 * 3600;
export const GATE_TTL_SEC = 5 * 60;
export const ACCESS_TTL_SEC = 90 * 24 * 3600;

/** Privacy policy / consent copy version stamped on subscribe (`consentVersion`). */
export const CONSENT_VERSION = '2026-09-13';

export const RESOURCE_SLUGS = [
  'claude-ppt-guidebook',
  'claude-prompt-set',
  'claude-design-landing-checklist',
  'ai-design-5-principles',
] as const;

/** Category chips on ResourceCard — label + Badge tone. */
export type ResourceCardBadgeDef = {
  label: string;
  tone: 'claude' | 'ppt' | 'design';
};

export const RESOURCE_CARD_BADGES: Record<
  (typeof RESOURCE_SLUGS)[number],
  ResourceCardBadgeDef[]
> = {
  'claude-ppt-guidebook': [
    { label: '클로드', tone: 'claude' },
    { label: 'PPT', tone: 'ppt' },
  ],
  'claude-prompt-set': [{ label: '클로드', tone: 'claude' }],
  'claude-design-landing-checklist': [{ label: '클로드 디자인', tone: 'design' }],
  'ai-design-5-principles': [{ label: '클로드 디자인', tone: 'design' }],
};

export function resourceCardBadges(slug: string): ResourceCardBadgeDef[] {
  if ((RESOURCE_SLUGS as readonly string[]).includes(slug)) {
    return RESOURCE_CARD_BADGES[slug as (typeof RESOURCE_SLUGS)[number]];
  }
  return [];
}

const PPT_THUMB = '/img/book-ppt.png';
const PROMPT_THUMB = '/img/book-prompt.png';
const PRINCIPLES_THUMB = '/img/book-design-principle.png';
const PLACEHOLDER_THUMB = '/img/book-placeholder.png';

const RESOURCE_THUMB: Partial<
  Record<(typeof RESOURCE_SLUGS)[number], string>
> = {
  'claude-ppt-guidebook': PPT_THUMB,
  'claude-prompt-set': PROMPT_THUMB,
  'ai-design-5-principles': PRINCIPLES_THUMB,
};

/** Book-cover thumbnail per slug; unknown slugs use the placeholder. */
export function resourceThumbnail(slug: string): string {
  if ((RESOURCE_SLUGS as readonly string[]).includes(slug)) {
    return (
      RESOURCE_THUMB[slug as (typeof RESOURCE_SLUGS)[number]] ??
      PLACEHOLDER_THUMB
    );
  }
  return PLACEHOLDER_THUMB;
}

export const BUILDING_OPTIONS = [
  { value: 'landing', label: '랜딩페이지' },
  { value: 'brand', label: '브랜드·로고' },
  { value: 'ppt', label: 'PPT' },
  { value: 'app', label: '서비스·앱' },
  { value: 'none', label: '아직 없음' },
] as const;

export const COURSE_WAITLIST_SLUG = 'course-waitlist';
