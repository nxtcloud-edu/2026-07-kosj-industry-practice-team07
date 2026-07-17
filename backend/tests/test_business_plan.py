from fastapi.testclient import TestClient

from app.main import app
from app.schemas.business_plan import BusinessPlanResponse, BusinessPlanSection
from app.services.llm_service import get_llm_service


def section(heading: str) -> BusinessPlanSection:
    return BusinessPlanSection(
        heading=heading,
        content=f"{heading}에 대한 검증 가능한 초안입니다.",
        key_points=["핵심 포인트 1", "핵심 포인트 2"],
        assumptions_to_validate=["사용자 인터뷰로 가설 확인"],
    )


class FakeLLMService:
    async def generate_business_plan(self, _request):  # type: ignore[no-untyped-def]
        return BusinessPlanResponse(
            title="AI 영어 튜터 사업계획서 초안",
            executive_summary="학생별 수준에 맞춘 학습 경험을 검증하는 초기 사업안입니다.",
            problem=section("문제 정의"),
            solution=section("해결 방안"),
            market=section("시장 및 고객"),
            revenue_model=section("수익 모델"),
            team=section("팀"),
            next_actions=["학생 인터뷰", "프로토타입 제작", "사용성 테스트"],
        )


def test_create_business_plan() -> None:
    app.dependency_overrides[get_llm_service] = lambda: FakeLLMService()
    client = TestClient(app)

    response = client.post(
        "/api/v1/business-plan",
        json={
            "idea_summary": "중고생 수준에 맞춰 문제를 추천하는 AI 영어 튜터",
            "target_customer": "영어 학습에 어려움을 느끼는 중고생",
            "problem_to_solve": "획일적인 콘텐츠가 개인별 수준 차이를 반영하지 못한다",
            "revenue_model_hint": "월 구독형",
            "team_description": "프론트엔드 2명, 백엔드 2명",
        },
    )

    app.dependency_overrides.clear()

    assert response.status_code == 200
    body = response.json()
    assert body["problem"]["heading"] == "문제 정의"
    assert len(body["next_actions"]) == 3
