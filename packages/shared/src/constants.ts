export const COOKIE_NAME = 'nodi_access';
export const CONFIRM_TTL_SEC = 7 * 24 * 3600;
export const GATE_TTL_SEC = 5 * 60;
export const ACCESS_TTL_SEC = 90 * 24 * 3600;

export const RESOURCE_SLUGS = [
  'claude-ppt-guidebook',
  'claude-prompt-set',
  'claude-design-landing-checklist',
  'ai-design-5-principles',
] as const;

export const BUILDING_OPTIONS = [
  { value: 'landing', label: '랜딩페이지' },
  { value: 'brand', label: '브랜드·로고' },
  { value: 'ppt', label: 'PPT' },
  { value: 'app', label: '서비스·앱' },
  { value: 'none', label: '아직 없음' },
] as const;

export const COURSE_WAITLIST_SLUG = 'course-waitlist';
