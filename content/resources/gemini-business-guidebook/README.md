# gemini-business-guidebook — content notes

## Source

Video script (2026-09, 노디 유튜브 제미나이 활용 편):

`월 300만원 아껴주는 제미나이 활용법 7가지`

Structure follows the script order: 시작 전 세팅 → ① 파일 생성 → ② 이미지(나노 바나나) → ③ 캔버스 슬라이드 → ④ 캔버스 앱 → ⑤ 젬 → ⑥ 지메일 → ⑦ 만들기 버튼 → 보너스 동영상.
Part numbers in the guidebook: Part 01 = 세팅, Part 02–08 = 기능 ①–⑦ (이미지와 캔버스 순서는 대본 그대로), Part 09 = 보너스.

YouTube URL not set in frontmatter until the video is published.

## Cover

`apps/web/public/img/book-gemini.png` — frontmatter `cover:` and `RESOURCE_THUMB` both point here.

## Fact check (Google 공식 도움말, 2026-09-17 확인)

Script claims that differ from current official docs — guidebook follows the docs, not the script:

- **나노 바나나 프로**: Gemini 앱 기본 이미지 모델은 Nano Banana 2. Nano Banana Pro는 유료 요금제에서 "Redo with Pro"로만 사용 가능. 대본은 나노 바나나 프로를 기본 기능처럼 소개함 → 본문은 "기본은 나노 바나나 2, 유료면 Pro로 다시 만들기"로 서술.
  https://support.google.com/gemini/answer/14286560
- **동영상 만들기(보너스)**: 개인 계정은 Google AI 요금제 필요, 만 18세 이상. 대본에 유료 언급 없음 → Part 00 표와 Part 09에 명시.
  https://support.google.com/gemini/answer/16126339
- **캔버스 슬라이드 PPTX 내보내기**: 소비자용 도움말은 Google Slides / PDF 내보내기만 안내(PowerPoint 직접 내보내기는 Gemini Enterprise 문서에만 있음). 대본은 PPTX 버튼을 시연함 → 본문은 "메뉴에 PPTX가 없으면 구글 슬라이드 → 파일 → 다운로드 → .pptx"로 우회 경로 병기.
  https://support.google.com/gemini/answer/16047321
- **캔버스 앱 공유 링크**: 링크를 가진 누구나 앱 데이터를 보고 수정 가능, 공유 링크는 gemini.google.com에서만 열림(모바일 앱 X) → Part 05·08에 경고 추가(원가 기본값·연락처 입력 칸 넣지 말 것).
- **개인 인텔리전스(연결된 앱·메모리·요청 사항)**: 만 18세 이상, 순차 배포(EEA·스위스·영국·나이지리아 제외) → Part 01에 "메뉴가 안 보일 수 있음" 명시.
  https://support.google.com/gemini/answer/16598406
- **파일 생성**: 2026-04-29 전체 사용자 대상 출시, 지원 형식 Docs/Sheets/Slides/PDF/DOCX/XLSX/CSV/LaTeX/TXT/RTF/MD.
  https://blog.google/innovation-and-ai/products/gemini-app/generate-files-in-gemini/
- **젬 지침 4요소**: 공식 도움말의 Persona / Task / Context / Format을 역할 / 할 일 / 배경 / 형식으로 옮김. "Use Gemini to re-write instructions" 버튼, Knowledge 파일 업로드 확인.
  https://support.google.com/gemini/answer/15235603

## Intentionally omitted

- 대본의 "월 300만 원" 절감 수치 — 근거 자료가 없어 본문에 쓰지 않음.
- "챗GPT GPTs는 유료, 젬은 무료" 비교 — 타사 플랜 정책이 자주 바뀌어 제외. 본문은 "젬은 무료 계정에서도 만들 수 있다"만 서술.
- 만들기 메뉴의 플래시카드 — 캔버스 도움말의 만들기 목록(웹페이지·인포그래픽·퀴즈·오디오 오버뷰)에 없어 표에서 제외.

## Additions beyond the script

- Part 05 마진율 두 가지 해석 비교표(원가 가산 vs 판매가 기준)와 검산 방법. 계산기 프롬프트는 판매가 기준 + 채널 수수료 반영식으로 작성.
- Part 02 견적서 프롬프트에 공급자 정보·부가세 표기 방식·[확인 필요] 규칙 추가.
- Quick 프롬프트에도 전부 고유 `id` 부여 (id 없는 quick은 `prompt-undefined` 앵커가 중복되고 복사 이벤트 id가 비어서).

## YouTube pinned comment

```
제미나이 1인 사업 실전 가이드북 (프롬프트 9종 포함) — 영상에서 쓴 프롬프트를 전부 복사해서 쓸 수 있게 정리했습니다
https://nodiworks.com/free/gemini-business-guidebook?utm_source=youtube&utm_medium=pinned_comment&utm_campaign=gemini-business-guidebook&utm_content=<video-id>
```
