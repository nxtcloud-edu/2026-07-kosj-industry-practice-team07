from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.diagnosis import DiagnosisRequest, DiagnosisResponse
from app.services.llm_service import LLMService, LLMServiceError, get_llm_service

router = APIRouter(prefix="/diagnosis", tags=["diagnosis"])


@router.post(
    "",
    response_model=DiagnosisResponse,
    status_code=status.HTTP_200_OK,
    summary="창업 아이디어 진단",
)
async def create_diagnosis(
    payload: DiagnosisRequest,
    llm_service: LLMService = Depends(get_llm_service),
) -> DiagnosisResponse:
    try:
        return await llm_service.diagnose(payload)
    except LLMServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc
