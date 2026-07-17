"""
Pydantic 요청/응답 모델 — 프론트엔드 인터페이스와 정확히 일치
"""

from pydantic import BaseModel
from typing import List


# ──────────────────────────────────────────────
# 1. 아이디어 진단 (POST /api/diagnose)
# ──────────────────────────────────────────────

class DiagnoseRequest(BaseModel):
    idea: str          # 아이디어 한 줄 설명
    target: str        # 타깃 고객
    problem: str       # 해결하려는 문제


class DiagnoseResponse(BaseModel):
    strengths: List[str]
    risks: List[str]
    suggestions: List[str]
    summary: str


# ──────────────────────────────────────────────
# 2. 지원사업 매칭 (POST /api/match)
# ──────────────────────────────────────────────

class MatchRequest(BaseModel):
    age: int           # 나이
    region: str        # 지역 (서울, 세종, 대전, 경기, 부산)
    field: str         # 분야 (IT, 교육, 헬스케어, 커머스, 콘텐츠)
    stage: str         # 창업 단계 (예비, 초기, 성장)


class ProgramConditions(BaseModel):
    ageRange: List[int]       # [min_age, max_age]
    regions: List[str]
    fields: List[str]
    stages: List[str]


class ProgramInfo(BaseModel):
    id: int
    name: str
    organization: str
    deadline: str
    maxFunding: str
    conditions: ProgramConditions


class MatchResultItem(BaseModel):
    program: ProgramInfo
    matchReasons: List[str]
    aiExplanation: str


class MatchResponse(BaseModel):
    results: List[MatchResultItem]
    totalCount: int
    note: str


# ──────────────────────────────────────────────
# 3. 사업계획서 초안 (POST /api/plan)
# ──────────────────────────────────────────────

class PlanRequest(BaseModel):
    idea: str
    target: str
    problem: str
    diagnosisSummary: str = ""   # 진단 결과 요약 (선택)


class PlanSection(BaseModel):
    title: str
    content: str
    isAIGenerated: bool


class PlanResponse(BaseModel):
    sections: List[PlanSection]
    disclaimer: str


# ──────────────────────────────────────────────
# 공통 에러 응답
# ──────────────────────────────────────────────

class ErrorResponse(BaseModel):
    error: str
    code: str
