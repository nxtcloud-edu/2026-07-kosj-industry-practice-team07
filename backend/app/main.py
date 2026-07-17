"""
FastAPI 앱 진입점
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routers import diagnose, match, plan

# .env 파일에서 환경변수 로드
load_dotenv()

app = FastAPI(
    title="Startup Copilot API",
    description="AI 기반 청년 예비창업자 사업화 지원 플랫폼 백엔드",
    version="0.1.0",
)

# CORS 설정 — 프론트엔드(Vite 기본 포트 5173, 3000)에서 접근 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(diagnose.router, prefix="/api", tags=["진단"])
app.include_router(match.router, prefix="/api", tags=["매칭"])
app.include_router(plan.router, prefix="/api", tags=["사업계획서"])


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "startup-copilot-api"}
