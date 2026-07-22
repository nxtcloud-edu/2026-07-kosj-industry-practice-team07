# 백엔드 배포 가이드 (Render)

## 1. Render 계정 생성

1. https://render.com 접속
2. GitHub 계정으로 가입/로그인

## 2. 새 Web Service 생성

1. Dashboard → **"New +"** → **"Web Service"**
2. **"Build and deploy from a Git repository"** 선택
3. GitHub 저장소 연결: `nxtcloud-edu/2026-07-kosj-industry-practice-team07`
4. 설정 입력:

| 항목 | 값 |
|------|-----|
| Name | `startup-copilot-api` |
| Region | `Singapore (Southeast Asia)` |
| Branch | `main` |
| Root Directory | `backend` |
| Runtime | `Python 3` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Instance Type | `Free` |

## 3. 환경변수 설정

서비스 생성 후 **"Environment"** 탭에서:

| Key | Value |
|-----|-------|
| `OPENAI_API_KEY` | `sk-실제키값` |
| `PYTHON_VERSION` | `3.11.9` |

## 4. 배포 확인

- 배포 완료 후 URL 확인 (예: `https://startup-copilot-api.onrender.com`)
- 브라우저에서 `https://startup-copilot-api.onrender.com/health` 접속
- `{"status": "ok", "service": "Startup Copilot API"}` 응답 확인
- Swagger 문서: `https://startup-copilot-api.onrender.com/docs`

## 5. 프론트엔드 연결

배포 URL 확인 후 프론트엔드에 적용:

### 로컬 개발 시
`frontend/.env.local` 파일 생성:
```
VITE_API_URL=http://localhost:8000
```

### Vercel 배포 시
Vercel 대시보드 → Settings → Environment Variables:
```
VITE_API_URL=https://startup-copilot-api.onrender.com
```

## 6. 주의사항

- Free tier는 15분 미사용 시 서버가 sleep됩니다 (첫 요청에 30~50초 대기)
- OpenAI API 키는 절대 코드에 하드코딩하지 마세요
- 자동 배포: main 브랜치에 push하면 자동으로 재배포됩니다

## 7. 트러블슈팅

| 증상 | 해결 |
|------|------|
| 배포 실패 (build error) | Render 로그 확인 → requirements.txt 패키지 이름 확인 |
| 502 Bad Gateway | Start Command 확인, PORT 환경변수 사용 여부 확인 |
| CORS 에러 | 프론트 URL이 CORS 허용 목록에 있는지 확인 |
| AI 응답 없음 | Environment에서 OPENAI_API_KEY 설정 확인 |
