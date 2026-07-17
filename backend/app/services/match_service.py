"""
규칙 기반 지원사업 매칭 로직
프론트엔드 Matching.tsx의 matchPrograms 함수와 동일한 로직을 서버 측에서 구현
"""

from typing import List
from app.database.db import programs_db


def match_programs(age: int, region: str, field: str, stage: str) -> List[dict]:
    """
    조건 기반 필터링 후 매칭 결과 반환 (최대 5건)

    규칙:
    - 4개 조건(나이, 지역, 분야, 단계)이 모두 부합해야 매칭
    - 매칭 근거(matchReasons)를 각 조건별로 생성
    - AI 설명(aiExplanation)을 자연어로 생성
    """
    matched = []

    for program in programs_db:
        reasons = []
        conditions = program["conditions"]

        # 나이 조건 체크
        age_range = conditions["ageRange"]
        age_match = age_range[0] <= age <= age_range[1]

        # 지역 조건 체크
        region_match = region in conditions["regions"]

        # 분야 조건 체크
        field_match = field in conditions["fields"]

        # 창업 단계 조건 체크
        stage_match = stage in conditions["stages"]

        # 4개 조건 모두 충족 시에만 매칭
        if not (age_match and region_match and field_match and stage_match):
            continue

        # 매칭 근거 생성
        if age_match:
            reasons.append(f"나이 조건 충족 ({age_range[0]}~{age_range[1]}세)")
        if region_match:
            reasons.append(f"지역 조건 일치 ({region})")
        if field_match:
            reasons.append(f"분야 조건 일치 ({field})")
        if stage_match:
            reasons.append(f"창업 단계 일치 ({stage})")

        # AI 설명 생성 (규칙 기반 템플릿)
        ai_explanation = (
            f"{program['name']}은(는) {program['organization']}에서 운영하는 지원사업입니다. "
            f"귀하의 조건({age}세, {region}, {field} 분야, {stage} 단계)이 모두 부합합니다. "
            f"최대 {program['maxFunding']}까지 지원 가능하며, "
            f"신청 마감일은 {program['deadline']}입니다."
        )

        matched.append({
            "program": program,
            "matchReasons": reasons,
            "aiExplanation": ai_explanation,
        })

    # 최대 5건 반환
    return matched[:5]
