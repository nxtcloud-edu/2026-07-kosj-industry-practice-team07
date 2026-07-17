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
