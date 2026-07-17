"""
사업계획서 초안 생성 API 라우터
POST /api/plan
"""

from fastapi import APIRouter
from app.models.schemas import PlanRequest, PlanResponse, PlanSection
from app.services.ai_service import generate_plan

router = APIRouter()


@router.post("/plan", response_model=PlanResponse)
async def create_plan(request: PlanRequest):
    """
    사업계획서 초안 생성

    - 입력: 아이디어, 타깃, 문제, (선택) 진단 요약
    - 출력: 5개 섹션 (문제 정의, 해결 방안, 시장 분석, 수익 모델, 팀 구성)
    - 각 섹션은 사용자가 검토·수정 가능
    """
    raw_sections = generate_plan(
        idea=request.idea,
        target=request.target,
        problem=request.problem,
        diagnosis_summary=request.diagnosisSummary,
    )

    sections = [
        PlanSection(
            title=s["title"],
            content=s["content"],
            isAIGenerated=s.get("isAIGenerated", True),
        )
        for s in raw_sections
    ]

    return PlanResponse(
        sections=sections,
        disclaimer="AI가 생성한 초안입니다. 반드시 직접 검토·수정 후 사용하세요.",
    )
