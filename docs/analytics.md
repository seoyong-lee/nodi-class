# Analytics (Amplitude)

브라우저 퍼널·세션 리플레이는 Amplitude. 동의 증빙·서버 전환 원본은 DynamoDB `nodi-events` — 역할이 다르다.

## 규칙

- `Submitted Email Gate`만 `email`(소문자) + `placement`(입력 위치)를 이벤트 속성으로 보낸다. Identify `user_id`는 계속 `sha256(email)` hex (`subscriberHash`). 쿠키·URL·서버 로그에는 원문을 넣지 않는다.
- 이벤트명 Title Case 과거형, 속성명 snake_case. 아래 12개 외 추가 금지 (`packages/shared/src/analytics.ts`).
- Session Replay: `amp-mask` on email/inquiry inputs; `NEXT_PUBLIC_AMPLITUDE_SR_SAMPLE_RATE` (default `1`, lower after launch e.g. `0.2`).

## Events

| Event | Props | Where |
| --- | --- | --- |
| Viewed Home Page | — | `/` |
| Viewed Resource Page | `resource_slug`, `access_state` (`locked`/`unlocked`) | `/free/[slug]` |
| Viewed Course Page | — | `/course` |
| Viewed Service Page | — | `/service` |
| Submitted Email Gate | `email`, `placement` (`home_top`/`home_bottom`/`resource`/`course`), `resource_slug?`, `building?`, `result` (`new`/`existing`/`error`) | EmailGate |
| Unlocked Resource | `resource_slug` | after `/unlock` (sessionStorage) |
| Clicked VOD Waitlist CTA | `placement` (`home_card`/`course_card`) | ProductCard VOD |
| Clicked Inquiry CTA | `placement` (`home_card`/`course_card`/`service_hero`) | service CTAs |
| Submitted Inquiry | `has_result_url` | InquiryForm |
| Clicked YouTube Link | `placement` (`nav`/`hero`/`resource_video`) | YouTube CTAs |
| Copied Prompt | `resource_slug`, `prompt_id` | Prompt copy |
| Clicked Unsubscribe | — | `/unsubscribe` done |

## Funnels

1. YouTube → resource: Viewed Resource (`utm_medium=pinned_comment`) → Submitted Email Gate → Unlocked Resource
2. Home: Viewed Home → Submitted Email Gate (by `placement`)
3. VOD: Viewed Course → Submitted Email Gate (`placement=course`)
4. Service: Viewed Service → Clicked Inquiry CTA → Submitted Inquiry
5. Consume: Unlocked Resource → Copied Prompt

## UTM (pinned comments)

`?utm_source=youtube&utm_medium=pinned_comment&utm_campaign=<resource_slug>&utm_content=<youtube_video_id>`

Amplitude autocapture records `initial_` / `last_` UTM user properties. `/subscribe` `source` = `utm_campaign` (fallback `src=`, else `direct`).
