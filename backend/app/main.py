from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.business_plan import router as business_plan_router
from app.api.diagnosis import router as diagnosis_router
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "청년 예비창업자의 아이디어 진단과 사업계획서 초안 생성을 지원하는 "
        "MVP 백엔드 API"
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(diagnosis_router, prefix=settings.api_v1_prefix)
app.include_router(business_plan_router, prefix=settings.api_v1_prefix)


@app.get("/health", tags=["system"])
async def health_check() -> dict[str, str]:
    return {"status": "ok", "service": settings.app_name}
