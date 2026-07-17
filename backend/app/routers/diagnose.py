"""
아이디어 진단 API 라우터
POST /api/diagnose
"""

from fastapi import APIRouter, HTTPException
from app.models.schemas import DiagnoseRequest, DiagnoseResponse
from app.services.ai_service import get_ai_service, LLMServiceError

router = APIRouter()


@router.post("/diagnose", response_model=DiagnoseResponse)
async def diagnose(request: DiagnoseRequest):
    """
    아이디어 진단

    - 입력: 아이디어, 타깃 고객, 해결하려는 문제
    - 출력: 강점, 리스크, 보완 제안, 요약
    - OpenAI API 호출 (키 없으면 폴백 응답)
    """
    try:
        result = await get_ai_service().diagnose_idea(
            idea=request.idea,
            target=request.target,
            problem=request.problem,
        )
    except LLMServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc))

    return DiagnoseResponse(
        strengths=result["strengths"],
        risks=result["risks"],
        suggestions=result["suggestions"],
        summary=result["summary"],
    )
