"""
아이디어 진단 API 라우터
POST /api/diagnose
"""

from fastapi import APIRouter
from app.models.schemas import DiagnoseRequest, DiagnoseResponse
from app.services.ai_service import diagnose_idea

router = APIRouter()


@router.post("/diagnose", response_model=DiagnoseResponse)
async def diagnose(request: DiagnoseRequest):
    """
    아이디어 진단

    - 입력: 아이디어, 타깃 고객, 해결하려는 문제
    - 출력: 강점, 리스크, 보완 제안, 요약
    - OpenAI API 호출 (실패 시 폴백 응답 제공)
    """
    result = diagnose_idea(
        idea=request.idea,
        target=request.target,
        problem=request.problem,
    )

    return DiagnoseResponse(
        strengths=result["strengths"],
        risks=result["risks"],
        suggestions=result["suggestions"],
        summary=result["summary"],
    )
