from fastapi.testclient import TestClient

from app.main import app
from app.schemas.diagnosis import DiagnosisResponse
from app.services.llm_service import get_llm_service


class FakeLLMService:
    async def diagnose(self, _request):  # type: ignore[no-untyped-def]
        return DiagnosisResponse(
            summary="개인화 영어 학습 문제를 해결하는 에듀테크 아이디어입니다.",
            strengths=["고객 문제가 분명함", "개인화 가치가 이해하기 쉬움"],
            risks=["학습 효과 검증 필요", "기존 서비스 대비 차별화 필요"],
            suggestions=["학생 5명 인터뷰", "핵심 기능 1개로 프로토타입 제작"],
            market_keywords=["에듀테크", "영어학습", "개인화", "AI튜터"],
            validation_questions=["매일 사용할 이유가 있는가?", "누가 비용을 지불하는가?"],
            uncertainty="시장 규모와 경쟁 현황은 외부 자료로 추가 검증해야 합니다.",
        )


def test_create_diagnosis() -> None:
    app.dependency_overrides[get_llm_service] = lambda: FakeLLMService()
    client = TestClient(app)

    response = client.post(
        "/api/v1/diagnosis",
        json={
            "idea_summary": "중고생 수준에 맞춰 문제를 추천하는 AI 영어 튜터",
            "target_customer": "영어 학습에 어려움을 느끼는 중고생",
            "problem_to_solve": "획일적인 콘텐츠가 개인별 수준 차이를 반영하지 못한다",
            "industry": "에듀테크",
        },
    )

    app.dependency_overrides.clear()

    assert response.status_code == 200
    body = response.json()
    assert body["ai_generated"] is True
    assert len(body["strengths"]) >= 2


def test_rejects_short_idea() -> None:
    client = TestClient(app)

    response = client.post(
        "/api/v1/diagnosis",
        json={
            "idea_summary": "짧음",
            "target_customer": "학생",
            "problem_to_solve": "학습이 어렵다",
        },
    )

    assert response.status_code == 422
