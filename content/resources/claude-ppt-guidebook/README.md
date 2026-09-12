# claude-ppt-guidebook — content notes

## 1. Missing image files (human must download)

Place into `apps/web/public/img/resources/claude-ppt-guidebook/`:

- `cover.png`
- `part03-first.png`
- `part03-fixed.png`
- `part03-applied.png`
- `part04-project.png`
- `part06-redesign.png`
- `part07-chart.png`
- `part08-compare.png`

Source Notion page images (8 attachments including cover) live on:

https://cascades-studio.notion.site/PPT-3d540dc0dcc08009bc18cce26662df57

## 2. Source Notion URL

https://cascades-studio.notion.site/PPT-3d540dc0dcc08009bc18cce26662df57

## 3. YouTube pinned comment (step 5)

```
클로드 PPT 실전 가이드북 (프롬프트 7종 포함) — 강의 출시 전까지 무료, 지금 받아두면 그 뒤에도 계속 열립니다
https://<site>/free/claude-ppt-guidebook?src=yt-ppt
```

## 4. Source quirks preserved (not fixed)

- Part 03 Quick Command 「로고 수정」: `로고 위치를 오른쪽 아래로 맞춰 줘.`
- Bonus Quick Command 「로고 수정」: `로고의 비율은 유지하고 오른쪽 하단으로 이동해 줘.` (wording differs in source)
- Part 07 chart Quick Command vs Bonus 「수정 가능한 차트」 body text also differs in source; both kept as-is
- Part 08 fix list: `내용이 정하도록 둔다` (source wording)
- REDESIGN / DE-AI / QC have no separate “when” blurb in Notion (unlike STYLE·REFINE·PROJECT·MASTER); `when` omitted on those three
- FONT example block keeps hex values from Notion (`#FF6B35`, `#111111`, `#FFFFFF`) — content copy, not UI tokens
- 「더 알아보기」 section intentionally omitted (VideoCard replaces it later)
