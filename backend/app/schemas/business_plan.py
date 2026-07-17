from pydantic import BaseModel, ConfigDict, Field

from app.schemas.diagnosis import DiagnosisResponse


class BusinessPlanRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    idea_summary: str = Field(..., min_length=10, max_length=1000)
    target_customer: str = Field(..., min_length=2, max_length=300)
    problem_to_solve: str = Field(..., min_length=5, max_length=700)
    diagnosis: DiagnosisResponse | None = Field(
        default=None,
        description="앞선 아이디어 진단 결과. 없으면 입력 정보만으로 초안을 생성합니다.",
    )
    revenue_model_hint: str | None = Field(default=None, max_length=500)
    team_description: str | None = Field(default=None, max_length=700)
    additional_context: str | None = Field(default=None, max_length=1500)


class BusinessPlanSection(BaseModel):
    heading: str
    content: str
    key_points: list[str] = Field(min_length=2, max_length=5)
    assumptions_to_validate: list[str] = Field(default_factory=list, max_length=4)


class BusinessPlanResponse(BaseModel):
    """MVP 제안서의 5개 핵심 섹션을 구조화한 사업계획서 초안."""

    title: str
    executive_summary: str
    problem: BusinessPlanSection
    solution: BusinessPlanSection
    market: BusinessPlanSection
    revenue_model: BusinessPlanSection
    team: BusinessPlanSection
    next_actions: list[str] = Field(min_length=3, max_length=7)
    disclaimer: str = Field(
        default="본 초안은 AI가 생성한 참고용 문서입니다. 사실관계·수치·출처를 사용자가 확인하고 수정한 뒤 제출해야 합니다."
    )
    ai_generated: bool = True
