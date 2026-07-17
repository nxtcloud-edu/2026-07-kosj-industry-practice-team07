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

## 실행 방법

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

### 백엔드

```bash
cd backend
# 추후 업데이트 예정
```

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | React + TypeScript + Tailwind CSS |
| 백엔드 | Python (FastAPI) |
| AI | OpenAI GPT-4 API + LangChain |
| DB | SQLite (MVP) |
| 배포 | Vercel (FE) + Railway/Render (BE) |

## 팀원

| 이름 | 역할 | 담당 |
|------|------|------|
| 황유림 | 프론트엔드 | UI/UX, 메인 페이지, 진단 결과 화면 |
| 최재형 | 프론트엔드 | 사업계획서 에디터, 매칭 필터, QA |
| 신효재 | 백엔드 (AI) | 프롬프트 설계, LLM 연동, 아키텍처 |
| 남건우 | 백엔드 (데이터) | 데이터 수집, 매칭 API, DB 설계 |
