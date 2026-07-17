"""
지원사업 매칭 API 라우터
POST /api/match
"""

from fastapi import APIRouter
from app.models.schemas import MatchRequest, MatchResponse, MatchResultItem, ProgramInfo, ProgramConditions
from app.services.match_service import match_programs

router = APIRouter()


@router.post("/match", response_model=MatchResponse)
async def match_support_programs(request: MatchRequest):
    """
    조건 기반 지원사업 매칭

    - 규칙 기반으로 자격 조건 필터링
    - 매칭 근거와 AI 설명을 함께 반환
    - 최대 5건까지 반환
    """
    raw_results = match_programs(
        age=request.age,
        region=request.region,
        field=request.field,
        stage=request.stage,
    )

    # Pydantic 모델로 변환
    results = []
    for item in raw_results:
        prog = item["program"]
        results.append(
            MatchResultItem(
                program=ProgramInfo(
                    id=prog["id"],
                    name=prog["name"],
                    organization=prog["organization"],
                    deadline=prog["deadline"],
                    maxFunding=prog["maxFunding"],
                    conditions=ProgramConditions(
                        ageRange=prog["conditions"]["ageRange"],
                        regions=prog["conditions"]["regions"],
                        fields=prog["conditions"]["fields"],
                        stages=prog["conditions"]["stages"],
                    ),
                ),
                matchReasons=item["matchReasons"],
                aiExplanation=item["aiExplanation"],
            )
        )

    # 결과 없을 때 안내 메시지
    if len(results) == 0:
        note = "조건에 부합하는 지원사업이 없습니다. 조건을 완화해보세요."
    else:
        note = f"조건에 부합하는 공고 {len(results)}건을 찾았습니다."

    return MatchResponse(
        results=results,
        totalCount=len(results),
        note=note,
    )
