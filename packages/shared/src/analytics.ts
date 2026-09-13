/** Amplitude event taxonomy — Title Case past tense; props snake_case. Do not add events. */
export type AnalyticsEvent =
  | { name: 'Viewed Home Page' }
  | {
      name: 'Viewed Resource Page';
      props: { resource_slug: string; access_state: 'locked' | 'unlocked' };
    }
  | { name: 'Viewed Course Page' }
  | { name: 'Viewed Service Page' }
  | {
      name: 'Submitted Email Gate';
      props: {
        email: string;
        placement: 'home_top' | 'home_bottom' | 'resource' | 'course';
        resource_slug?: string;
        building?: 'landing' | 'brand' | 'ppt' | 'app' | 'none';
        result: 'new' | 'existing' | 'error';
        duration_ms?: number;
      };
    }
  | { name: 'Unlocked Resource'; props: { resource_slug: string } }
  | {
      name: 'Clicked VOD Waitlist CTA';
      props: { placement: 'home_card' | 'course_card' };
    }
  | {
      name: 'Clicked Inquiry CTA';
      props: { placement: 'home_card' | 'course_card' | 'service_hero' };
    }
  | { name: 'Submitted Inquiry'; props: { has_result_url: boolean } }
  | {
      name: 'Clicked YouTube Link';
      props: { placement: 'nav' | 'hero' | 'resource_video' };
    }
  | {
      name: 'Copied Prompt';
      props: { resource_slug: string; prompt_id: string };
    }
  | { name: 'Clicked Unsubscribe' };
