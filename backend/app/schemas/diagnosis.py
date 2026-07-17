from pydantic import BaseModel, ConfigDict, Field, field_validator


class DiagnosisRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    idea_summary: str = Field(
        ...,
        min_length=10,
        max_length=1000,
        description="창업 아이디어 요약",
        examples=["중고생의 수준에 맞춰 문제를 추천하는 AI 영어 튜터"],
    )
    target_customer: str = Field(
        ...,
        min_length=2,
        max_length=300,
        description="핵심 타깃 고객",
        examples=["영어 학습에 어려움을 느끼는 중고생과 학부모"],
    )
    problem_to_solve: str = Field(
        ...,
        min_length=5,
        max_length=700,
        description="해결하려는 사용자 문제",
        examples=["개인별 수준 차이 때문에 획일적인 학습 콘텐츠의 효과가 낮다"],
    )
    industry: str | None = Field(
        default=None,
        max_length=100,
        description="선택 입력: 산업 또는 분야",
        examples=["에듀테크"],
    )

    @field_validator("idea_summary", "target_customer", "problem_to_solve")
    @classmethod
    def reject_blank_text(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("공백만 입력할 수 없습니다.")
        return value


class DiagnosisResponse(BaseModel):
    """LLM 구조화 출력과 API 응답에 함께 사용하는 스키마."""

    summary: str = Field(description="아이디어와 문제의 핵심 요약")
    strengths: list[str] = Field(min_length=2, max_length=5)
    risks: list[str] = Field(min_length=2, max_length=5)
    suggestions: list[str] = Field(min_length=2, max_length=5)
    market_keywords: list[str] = Field(min_length=3, max_length=8)
    validation_questions: list[str] = Field(min_length=2, max_length=5)
    uncertainty: str = Field(description="분석의 한계와 추가 검증이 필요한 부분")
    disclaimer: str = Field(
        default="본 분석은 AI가 생성한 참고용 정보이며, 실제 시장조사·투자·사업 결정 전 별도 검증이 필요합니다."
    )
    ai_generated: bool = True
