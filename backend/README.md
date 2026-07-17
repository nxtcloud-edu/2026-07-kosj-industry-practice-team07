# Backend — AI 기반 청년 예비창업자 사업화 지원 플랫폼

## 실행 방법

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt

# .env 파일 생성 (.env.example 참고)
copy .env.example .env
# OPENAI_API_KEY 값을 실제 키로 변경

# 서버 실행
uvicorn app.main:app --reload --port 8000
```

- Swagger UI: `http://localhost:8000/docs`
- 상태 확인: `GET http://localhost:8000/health`

## API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| GET | /health | 서버 상태 확인 |
| POST | /api/diagnose | 아이디어 진단 |
| POST | /api/match | 지원사업 매칭 |
| POST | /api/plan | 사업계획서 초안 생성 |

## 기술 스택

- Python 3.9+
- FastAPI
- OpenAI GPT-4 API
- SQLite (MVP)

## 프로젝트 구조

```text
backend/
├── app/
│   ├── main.py              ← FastAPI 앱 진입점
│   ├── routers/
│   │   ├── diagnose.py      ← POST /api/diagnose
│   │   ├── match.py         ← POST /api/match
│   │   └── plan.py          ← POST /api/plan
│   ├── services/
│   │   ├── ai_service.py    ← OpenAI API 호출 로직
│   │   └── match_service.py ← 규칙 기반 필터 로직
│   ├── models/
│   │   └── schemas.py       ← Pydantic 요청/응답 모델
│   └── database/
│       └── db.py            ← JSON 데이터 로드
├── data/
│   └── programs.json        ← 지원사업 10건
├── requirements.txt
├── .env.example
└── test_api.py
```

## 설계 원칙

- 성공 가능성이나 시장 규모를 근거 없이 단정하지 않도록 프롬프트에 제약을 둡니다.
- 모든 결과에 AI 생성·참고용 안내를 포함합니다.
- 매칭은 규칙 기반 필터로 결정하고, AI는 추천 이유 설명만 담당합니다.
- MVP에서는 사용자 아이디어 원문을 서버에 저장하지 않습니다.
- API 키가 없어도 폴백 응답으로 동작합니다.
