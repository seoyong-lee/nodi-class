export const COOKIE_NAME = 'nodi_access';
export const CONFIRM_TTL_SEC = 7 * 24 * 3600;
export const GATE_TTL_SEC = 5 * 60;
export const ACCESS_TTL_SEC = 90 * 24 * 3600;

/** Privacy policy / consent copy version stamped on subscribe (`consentVersion`). */
export const CONSENT_VERSION = '2026-09-12';

export const RESOURCE_SLUGS = [
  'claude-ppt-guidebook',
  'claude-prompt-set',
  // 'claude-design-landing-checklist',
  'ai-design-5-principles',
] as const;

/** Card type chip for ResourceCard (not YouTube-gated). */
export const RESOURCE_BADGE: Record<(typeof RESOURCE_SLUGS)[number], string> = {
  'claude-ppt-guidebook': '가이드북',
  'claude-prompt-set': '프롬프트',
  // 'claude-design-landing-checklist': '체크리스트',
  'ai-design-5-principles': '요약본',
};

export function resourceBadge(slug: string): string {
  if ((RESOURCE_SLUGS as readonly string[]).includes(slug)) {
    return RESOURCE_BADGE[slug as (typeof RESOURCE_SLUGS)[number]];
  }
  return '무료 자료';
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
