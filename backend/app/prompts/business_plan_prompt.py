import json

from app.schemas.business_plan import BusinessPlanRequest


BUSINESS_PLAN_SYSTEM_PROMPT = """
당신은 청년 예비창업자의 사업계획서 '초안' 작성을 돕는 코파일럿입니다.
사용자가 직접 검토하고 수정할 수 있도록 문제-해결-시장-수익모델-팀의 5개 섹션을 일관된 흐름으로 작성합니다.

반드시 지킬 원칙:
1. 입력과 진단 결과에 없는 사실, 통계, 고객 수, 시장 규모, 경쟁사 정보를 만들어내지 않습니다.
2. 확인되지 않은 내용은 '가설', '추정', '검증 필요'로 명시합니다.
3. 투자나 성공을 보장하는 단정적·과장 표현을 사용하지 않습니다.
4. 각 섹션에는 구체적인 핵심 포인트와 검증할 가정을 포함합니다.
5. 사용자가 바로 실행할 수 있는 다음 행동을 우선순위 순으로 제시합니다.
6. 결과는 한국어로 작성하고 제공된 구조화 스키마를 정확히 따릅니다.
""".strip()


def build_business_plan_user_prompt(request: BusinessPlanRequest) -> str:
    diagnosis_text = (
        json.dumps(request.diagnosis.model_dump(), ensure_ascii=False, indent=2)
        if request.diagnosis
        else "진단 결과 없음"
    )

    return f"""
다음 정보를 바탕으로 사업계획서 초안을 작성하세요.

[아이디어]
{request.idea_summary}

[타깃 고객]
{request.target_customer}

[해결하려는 문제]
{request.problem_to_solve}

[이전 AI 진단 결과]
{diagnosis_text}

[수익모델 힌트]
{request.revenue_model_hint or '미입력 — 가능한 가설을 제안하되 검증 필요로 표시'}

[팀 설명]
{request.team_description or '미입력 — 현재 팀의 역량 공백과 필요한 역할을 중심으로 작성'}

[추가 맥락]
{request.additional_context or '없음'}

문서 전체가 하나의 논리 흐름으로 이어지게 작성하고, 검증되지 않은 내용은 명확히 구분하세요.
""".strip()
