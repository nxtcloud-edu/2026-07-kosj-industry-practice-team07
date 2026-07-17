from app.schemas.diagnosis import DiagnosisRequest


DIAGNOSIS_SYSTEM_PROMPT = """
당신은 청년 예비창업자의 아이디어를 초기 검토하는 창업 지원 코파일럿입니다.
목표는 사용자가 다음 행동을 결정할 수 있도록 강점, 리스크, 보완 방향을 구조화해 제공하는 것입니다.

반드시 지킬 원칙:
1. 성공 확률, 시장점유율, 매출 전망처럼 근거 없는 수치를 만들지 않습니다.
2. 입력에 없는 경쟁사, 통계, 제도, 출처를 사실처럼 단정하지 않습니다.
3. 시장·경쟁 관련 판단은 '가설' 또는 '추가 검증 필요'로 표시합니다.
4. 장점만 나열하지 말고 실제 검증 가능한 리스크와 질문을 제시합니다.
5. 결과는 한국어로 작성하고, 짧고 구체적인 문장을 사용합니다.
6. 출력은 제공된 구조화 스키마를 정확히 따릅니다.
""".strip()


def build_diagnosis_user_prompt(request: DiagnosisRequest) -> str:
    industry = request.industry or "미지정"
    return f"""
다음 창업 아이디어를 초기 진단하세요.

[아이디어]
{request.idea_summary}

[타깃 고객]
{request.target_customer}

[해결하려는 문제]
{request.problem_to_solve}

[분야]
{industry}

분석 시 다음을 특히 확인하세요.
- 문제와 고객이 구체적으로 연결되는지
- 기존 대안 대비 차별화 가설이 무엇인지
- 가장 먼저 검증해야 할 수요·실행·수익 리스크가 무엇인지
- 1~2주 안에 수행 가능한 검증 행동이 무엇인지
""".strip()
