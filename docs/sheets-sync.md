# Google Sheets 리드 동기화

매일 UTC 22:00에 `subscribers` / `inquiries` 미동기 행을 시트에 append 합니다.

## 탭

| 탭 | 출처 |
| --- | --- |
| `VOD사전예약` | `subscribers.tags`에 `course-waitlist` |
| `무료자료` | `subscribers.tags`에 `resource:*` |
| `서비스문의` | `nodi-class-inquiries` |

헤더 권장: `생성일시, 이메일, 이름/추가필드, 출처`

## 1. Google Cloud 서비스 계정

1. GCP 프로젝트에서 서비스 계정 생성 → JSON 키 다운로드
2. Google Sheets API 사용 설정
3. 대상 스프레드시트를 서비스 계정 이메일과 **편집자**로 공유
4. 시트에 위 세 탭을 미리 만들어 둠

## 2. Secrets Manager

```bash
aws secretsmanager create-secret \
  --name nodi-class/google-sheets-sa \
  --secret-string file://sa.json \
  --region ap-northeast-2
```

## 3. CDK 배포

```bash
pnpm infra:deploy -- \
  -c googleSheetId=<SPREADSHEET_ID> \
  -c sheetsAlarmEmail=you@example.com \
  -c enableInquirySheetStream=true   # 선택: 문의 실시간 스트림
```

`enableInquirySheetStream=true`면 inquiries 테이블 스트림이 sync-sheets를 트리거합니다.

## 4. 로컬/수동 invoke

```bash
# 배포 후
aws lambda invoke \
  --function-name nodi-class-sync-sheets \
  --payload '{}' \
  --cli-binary-format raw-in-base64-out \
  /tmp/sync-out.json \
  --region ap-northeast-2

aws lambda invoke \
  --function-name nodi-class-privacy-cleanup \
  --payload '{}' \
  --cli-binary-format raw-in-base64-out \
  /tmp/privacy-out.json \
  --region ap-northeast-2
```

## 동기화 마커

성공한 항목만 `syncedAt`(ISO)를 UpdateItem 합니다. 탭 단위 실패는 로그(`sync_sheets.*_fail`) 후 다음 항목으로 진행합니다.
