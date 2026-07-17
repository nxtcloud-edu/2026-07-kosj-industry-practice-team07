"""
FastAPI 앱 진입점
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routers import diagnose, match, plan

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="청년 예비창업자의 아이디어 진단·지원사업 매칭·사업계획서 초안 생성을 지원하는 MVP 백엔드 API",
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(diagnose.router, prefix="/api", tags=["진단"])
app.include_router(match.router, prefix="/api", tags=["매칭"])
app.include_router(plan.router, prefix="/api", tags=["사업계획서"])


@app.get("/health", tags=["system"])
async def health_check():
    return {"status": "ok", "service": settings.app_name}
