/** EmailGate checkbox label — unchecked by default, required. PLAN §3. */
export const SUBSCRIBE_CONSENT_LABEL =
  '이메일 수집·이용과 메일 수신에 동의합니다.';

/** Shown under the checkbox. PLAN §3. */
export const SUBSCRIBE_CONSENT_DETAIL =
  '자료 전달, 새 자료·강의·서비스 소식 안내 목적으로 이메일 주소와 동의 기록(시각·경로·문서 버전)을 수집합니다. 수신 해지 시까지 보관하며, 모든 메일의 수신거부 링크로 언제든 해지할 수 있습니다. 해지하면 자료 페이지도 닫힙니다.';

export const PRIVACY_LINK_LABEL = '개인정보 처리방침';

/** Inquiry form — project review, not mail subscription. */
export const INQUIRY_CONSENT_LABEL = '개인정보 수집·이용에 동의합니다.';

/** Shown briefly if unlock navigation is delayed. */
export const GATE_SUBMITTED_LABEL = '열렸습니다. 메일로도 보냈습니다.';

/** When subscribe succeeds but mail was throttled within 10 minutes. */
export const GATE_MAIL_THROTTLED_LABEL = '이미 보낸 메일을 확인해 주세요';

/** Unlocked cookie state under the gate slot. */
export const GATE_ACTIVE_LABEL = '메일로도 보냈습니다';

/** `/free/[slug]` common conversion copy — PLAN §3.2 (resource-agnostic) */
export const RESOURCE_HERO_CTA = '전자책 바로 열기';
export const RESOURCE_HERO_UNLOCKED_CTA = '구입 완료';
export const RESOURCE_HERO_HELPER = '이메일 등록 후 바로 열립니다 · 무료';

export const RESOURCE_INTRO_LEAD =
  '필요한 내용을 찾느라 여기저기 헤매고 있지 않으셨나요?';
export const RESOURCE_INTRO_BODY = [
  '검색해보고, 저장해두고, 필요할 때 다시 찾아보려다가 결국 어디에 있었는지 잊어버리는 경우가 많습니다.',
  '그래서 실제로 바로 써볼 수 있는 내용만 한곳에 정리했습니다.',
  '복잡하게 공부하기보다 필요한 부분부터 보고 그대로 따라 하거나, 복사해서 바로 활용할 수 있도록 만들었습니다.',
] as const;

export const RESOURCE_INCLUDED_HEADING = '이 자료에는';
export const RESOURCE_INCLUDED_AFTER = [
  '단순히 내용을 모아놓은 자료가 아니라,\n제가 직접 써보고 여러 번 수정하면서 계속 사용하게 된 내용들을 중심으로 정리했습니다.',
  '처음에는 저도 필요해서 하나씩 따로 정리해두던 내용이었는데, 매번 다시 찾고 설명하는 대신 한 번 받아두고 필요할 때마다 다시 꺼내 쓸 수 있는 형태로 묶었습니다.',
] as const;

export const RESOURCE_AUDIENCE_HEADING = '이런 분이라면 특히 유용합니다';
export const RESOURCE_AUDIENCE_ITEMS = [
  '어디서부터 시작해야 할지 막막한 분',
  '여러 정보를 찾아다니는 시간을 줄이고 싶은 분',
  '결과물을 직접 만들어보고 싶은 분',
  '한 번 익힌 방법을 다음 작업에도 반복해서 활용하고 싶은 분',
] as const;

export const RESOURCE_VALUE_BODY =
  '이 자료 하나가 처음부터 다시 검색하고 시행착오를 반복하는 시간을 줄이는 기준이 될 수 있습니다.\n필요한 부분부터 가져가서 지금 하고 있는 작업에 바로 활용해보세요.';

export const RESOURCE_ORIGIN_BODY =
  '영상이나 실제 작업을 준비하면서 제가 직접 사용하고 정리해둔 내용들입니다.\n한 번 만들고 끝낸 자료가 아니라,실제로 써보면서 부족한 부분을 계속 수정해왔습니다.\n필요한 분들이 처음부터 같은 시행착오를 반복하지 않았으면 해서 무료로 정리해두었습니다.';

export const RESOURCE_GATE_TITLE = '지금 무료로 공개합니다';
export const RESOURCE_GATE_DESCRIPTION =
  '아래에서 이메일을 등록하면 전체 자료를 바로 확인할 수 있습니다. 한 번 등록하면 다른 전자책도 별도 입력 없이 계속 보실 수 있습니다.';
export const RESOURCE_GATE_BUTTON = '전자책 바로 열기';
export const RESOURCE_GATE_HELPER =
  '등록 즉시 열립니다 · 비용이 발생하지 않습니다';
export const RESOURCE_GATE_NOTICE =
  '무료 공개 종료 일정은 강의 출시 전에 이 페이지와 이메일로 미리 안내드립니다.';

export const RESOURCE_AUTHOR_NAME = '노디';
export const RESOURCE_AUTHOR_BODY =
  '5년차 프로덕트 엔지니어로 일하며\n직접 제품을 만들고 운영해왔습니다.';
export const RESOURCE_AUTHOR_SMALL = '유튜브 노디 AI 운영';
export const RESOURCE_RELATED_HEADING = '다른 전자책도 둘러보세요';

export const GATE_ACTIVE_RESUBSCRIBE_LABEL =
  '이미 등록된 주소입니다. 메일로 링크를 다시 보냈습니다.';

export const GATE_NOT_REGISTERED_LABEL = '등록된 주소가 아닙니다';

export const FORM_ERROR_LABEL = '잠시 후 다시 시도해 주세요.';

export const INQUIRY_DONE_LABEL =
  '검토 요청을 받았습니다. 2영업일 내 회신드립니다.';

export const UNSUBSCRIBE_DONE_LABEL = '수신을 해지했습니다.';
