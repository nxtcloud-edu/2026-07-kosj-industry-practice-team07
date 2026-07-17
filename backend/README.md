# AI 창업 코파일럿 Backend

청년 예비창업자가 **아이디어 입력 → AI 진단 → 사업계획서 초안 생성** 흐름을 경험할 수 있도록 만든 FastAPI 기반 MVP 백엔드입니다.

현재 범위는 다음 두 API에 집중합니다.

- 아이디어 진단: 강점, 리스크, 보완 제안, 검증 질문 생성
- 사업계획서 초안: 문제, 해결, 시장, 수익모델, 팀의 5개 섹션 생성

지원사업 매칭 API는 공고 데이터 구조와 규칙 필터가 확정된 뒤 별도 모듈로 추가하는 것을 권장합니다.

## 1. 실행 방법

Python 3.11 이상을 권장합니다.

```bash
cd backend
python -m venv .venv

# macOS / Linux
source .venv/bin/activate

# Windows PowerShell
# .venv\Scripts\Activate.ps1

pip install -r requirements.txt
cp .env.example .env
```

`.env`에 실제 OpenAI API 키를 입력합니다.

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5.6
```

서버 실행:

```bash
uvicorn app.main:app --reload --port 8000
```

- Swagger UI: `http://localhost:8000/docs`
- 상태 확인: `GET http://localhost:8000/health`

## 2. API

### 아이디어 진단

`POST /api/v1/diagnosis`

```json
{
  "idea_summary": "중고생 수준에 맞춰 문제를 추천하는 AI 영어 튜터",
  "target_customer": "영어 학습에 어려움을 느끼는 중고생과 학부모",
  "problem_to_solve": "획일적인 콘텐츠가 개인별 수준 차이를 반영하지 못한다",
  "industry": "에듀테크"
}
```

응답에는 다음 정보가 포함됩니다.

- 핵심 요약
- 강점과 리스크
- 보완 제안
- 시장 탐색 키워드
- 우선 검증 질문
- 불확실성 및 참고용 안내

### 사업계획서 초안

`POST /api/v1/business-plan`

```json
{
  "idea_summary": "중고생 수준에 맞춰 문제를 추천하는 AI 영어 튜터",
  "target_customer": "영어 학습에 어려움을 느끼는 중고생과 학부모",
  "problem_to_solve": "획일적인 콘텐츠가 개인별 수준 차이를 반영하지 못한다",
  "revenue_model_hint": "학부모 대상 월 구독형",
  "team_description": "프론트엔드 2명, 백엔드/AI 1명, 데이터 1명",
  "additional_context": "4주 MVP에서는 진단부터 초안 생성까지 한 시나리오를 완주한다"
}
```

앞선 진단 API 응답 전체를 `diagnosis` 필드에 넣으면 동일한 맥락을 이어서 초안을 생성할 수 있습니다.

## 3. 테스트

실제 OpenAI API를 호출하지 않고 의존성을 가짜 서비스로 교체해 테스트합니다.

```bash
pytest -q
```

## 4. 프로젝트 구조

```text
backend/
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── diagnosis.py
│   │   └── business_plan.py
│   ├── services/
│   │   └── llm_service.py
│   ├── prompts/
│   │   ├── diagnosis_prompt.py
│   │   └── business_plan_prompt.py
│   ├── schemas/
│   │   ├── diagnosis.py
│   │   └── business_plan.py
│   └── core/
│       └── config.py
├── tests/
├── requirements.txt
├── .env.example
└── README.md
```

실행 가능한 Python 패키지를 위해 각 폴더에 `__init__.py`도 포함되어 있습니다.

## 5. 설계 원칙

- OpenAI Responses API의 구조화 출력을 사용해 Pydantic 응답 형식을 강제합니다.
- 성공 가능성이나 시장 규모를 근거 없이 단정하지 않도록 프롬프트에 제약을 둡니다.
- 모든 결과에 AI 생성·참고용 안내를 포함합니다.
- MVP에서는 사용자 아이디어 원문을 데이터베이스나 애플리케이션 로그에 저장하지 않습니다.
- API 키가 없거나 AI 서비스에 장애가 있으면 의미 있는 HTTP 오류를 반환합니다.

## 6. 다음 구현 권장 순서

1. 지원사업 공고 10~20건을 JSON 또는 SQLite로 구조화
2. 나이·지역·분야·창업 단계 규칙 필터 구현
3. AI는 필터 결과의 추천 이유만 설명하도록 역할 제한
4. 진단 → 매칭 → 사업계획서 생성 통합 시나리오 테스트
