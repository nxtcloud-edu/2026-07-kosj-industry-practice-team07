# AI 기반 청년 예비창업자 사업화 지원 플랫폼

> 아이디어 입력 → AI 진단 → 지원사업 매칭 → 사업계획서 초안 생성까지, 예비창업자의 "다음 행동"을 안내하는 서비스

## 프로젝트 구조

```
frontend/   ← React + TypeScript + Tailwind CSS (프론트엔드)
backend/    ← Python FastAPI (백엔드 / AI)
docs/       ← 제안서, 아이디어노트 등 문서
```

## 주요 기능

1. **AI 아이디어 진단** — 아이디어 입력 시 시장성·경쟁 분석 리포트 제공
2. **조건 기반 지원사업 매칭** — 나이, 지역, 분야 등 조건으로 적합 지원사업 추천
3. **사업계획서 AI 작성 보조** — 문제-해결-시장-수익모델-팀 구조 초안 생성 + 편집

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

## 서비스 흐름

```text
아이디어 입력
    ↓
AI 아이디어 진단
    ↓
지원사업 조건 입력
    ↓
맞춤 지원사업 추천
    ↓
사업계획서 초안 생성
    ↓
지원 준비 체크리스트 확인
```

## 프로젝트 구조

```text
.
├── frontend/                 # React 기반 사용자 화면
│   ├── src/
│   │   ├── api/              # 백엔드 API 호출
│   │   ├── components/       # 공통 UI 컴포넌트
│   │   ├── context/          # 서비스 상태 관리
│   │   └── pages/            # 주요 기능별 화면
│   └── .env.local.example    # 프론트엔드 환경변수 예시
│
├── backend/                  # FastAPI 기반 백엔드 및 AI
│   ├── app/
│   │   ├── core/             # 환경설정
│   │   ├── models/           # 요청·응답 데이터 모델
│   │   ├── prompts/          # AI 프롬프트
│   │   ├── routers/          # API 엔드포인트
│   │   └── services/         # AI 호출 및 매칭 로직
│   ├── data/
│   │   └── programs.json     # MVP 지원사업 데이터
│   ├── tests/                # 백엔드 테스트
│   ├── requirements.txt
│   └── render.yaml           # Render 배포 설정
│
└── docs/
    └── deploy-guide.md       # 백엔드 배포 및 연결 가이드
```

## 기술 스택

프론트엔드: React 19, TypeScript, Vite, Tailwind CSS
라우팅: React Router
백엔드: Python 3.11, FastAPI
AI: OpenAI API (gpt-4o-mini)
데이터: JSON 기반 지원사업 데이터
API 문서: Swagger UI
백엔드 배포: Render

## 실행 방법

### 1. 저장소 내려받기

```bash
git clone https://github.com/nxtcloud-edu/2026-07-kosj-industry-practice-team07.git
cd 2026-07-kosj-industry-practice-team07
```

### 2. 백엔드 실행

```bash
cd backend
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

macOS/Linux:

```bash
source venv/bin/activate
```

필요한 패키지를 설치합니다.

```bash
pip install -r requirements.txt
```

`backend/.env.example`을 참고하여 `backend/.env` 파일을 생성합니다.

```env
OPENAI_API_KEY=your-openai-api-key
HOST=0.0.0.0
PORT=8000
```

> 실제 API 키는 GitHub 저장소에 커밋하지 않습니다.

백엔드 서버를 실행합니다.

```bash
uvicorn app.main:app --reload --port 8000
```

로컬 실행 주소:

* API 서버: `http://localhost:8000`
* Health Check: `http://localhost:8000/health`
* Swagger 문서: `http://localhost:8000/docs`

### 3. 프론트엔드 실행

새 터미널을 열고 다음 명령어를 실행합니다.

```bash
cd frontend
npm install
```

`frontend/.env.local` 파일을 생성하고 사용할 백엔드 주소를 설정합니다.

로컬 백엔드를 사용하는 경우:

```env
VITE_API_URL=http://localhost:8000
```

배포된 백엔드를 사용하는 경우:

```env
VITE_API_URL=https://startup-copilot-api.onrender.com
```

프론트엔드를 실행합니다.

```bash
npm run dev
```

기본 접속 주소:

```text
http://localhost:5173
```

## 배포된 백엔드

* API 주소: https://startup-copilot-api.onrender.com
* Health Check: https://startup-copilot-api.onrender.com/health
* Swagger 문서: https://startup-copilot-api.onrender.com/docs

Render 무료 인스턴스는 일정 시간 요청이 없으면 절전 상태로 전환될 수 있어 첫 요청에 시간이 걸릴 수 있습니다.

## API 엔드포인트

| Method | Endpoint        | 설명            |
| ------ | --------------- | ------------- |
| `GET`  | `/health`       | 서버 작동 상태 확인   |
| `POST` | `/api/diagnose` | 창업 아이디어 AI 진단 |
| `POST` | `/api/match`    | 조건 기반 지원사업 매칭 |
| `POST` | `/api/plan`     | 사업계획서 초안 생성   |

## API 요청 예시

### 아이디어 진단

```json
{
  "idea": "고령자의 낙상을 감지하는 스마트 욕실 센서",
  "target": "혼자 거주하는 고령자와 보호자",
  "problem": "욕실에서 사고가 발생해도 빠르게 발견하기 어렵다"
}
```

### 지원사업 매칭

```json
{
  "age": 24,
  "region": "세종",
  "field": "AI",
  "stage": "예비창업"
}
```

### 사업계획서 초안 생성

```json
{
  "idea": "고령자의 낙상을 감지하는 스마트 욕실 센서",
  "target": "혼자 거주하는 고령자와 보호자",
  "problem": "욕실에서 사고가 발생해도 빠르게 발견하기 어렵다",
  "diagnosisSummary": "고령자의 안전 문제를 해결하기 위한 IoT 기반 아이디어"
}
```

## 설계 원칙

* 사용자 아이디어 원문을 MVP 서버에 별도로 저장하지 않습니다.
* AI가 시장 규모나 성공 가능성을 근거 없이 단정하지 않도록 프롬프트에 제약을 적용합니다.
* 지원사업 매칭은 규칙 기반으로 처리하여 AI 응답에만 의존하지 않습니다.
* AI가 생성한 사업계획서는 참고용 초안으로 제공하며 사용자의 검토와 수정을 전제로 합니다.
* OpenAI API 키는 프론트엔드나 GitHub에 노출하지 않고 백엔드 환경변수로 관리합니다.
* API 키가 없어도 개발과 화면 테스트가 가능하도록 폴백 응답을 제공합니다.

## 기술 스택

프론트엔드: React 19, TypeScript, Vite, Tailwind CSS
라우팅: React Router
백엔드: Python 3.11, FastAPI
AI: OpenAI API (gpt-4o-mini)
데이터: JSON 기반 지원사업 데이터
API 문서: Swagger UI
백엔드 배포: Render

## 팀원

| 이름 | 역할 | 담당 |
|------|------|------|
| 황유림 | 프론트엔드 | UI/UX, 메인 페이지, 진단 결과 화면 |
| 최재형 | 프론트엔드 | 사업계획서 에디터, 매칭 필터, QA |
| 신효재 | 백엔드 (AI) | 프롬프트 설계, LLM 연동, 아키텍처 |
| 남건우 | 백엔드 (데이터) | 데이터 수집, 매칭 API, DB 설계 |
