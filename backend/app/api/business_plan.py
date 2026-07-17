from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.business_plan import BusinessPlanRequest, BusinessPlanResponse
from app.services.llm_service import LLMService, LLMServiceError, get_llm_service

router = APIRouter(prefix="/business-plan", tags=["business-plan"])


@router.post(
    "",
    response_model=BusinessPlanResponse,
    status_code=status.HTTP_200_OK,
    summary="사업계획서 5개 섹션 초안 생성",
)
async def create_business_plan(
    payload: BusinessPlanRequest,
    llm_service: LLMService = Depends(get_llm_service),
) -> BusinessPlanResponse:
    try:
        return await llm_service.generate_business_plan(payload)
    except LLMServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc
