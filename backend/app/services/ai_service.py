"""
OpenAI API 호출 로직
아이디어 진단 및 사업계획서 초안 생성에 사용
"""

import os
import json
from typing import Optional
from openai import OpenAI

# OpenAI 클라이언트 (환경변수에서 키 로드)
client: Optional[OpenAI] = None


def get_client() -> OpenAI:
    """OpenAI 클라이언트 싱글턴"""
    global client
    if client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key or api_key.startswith("sk-your"):
            raise RuntimeError("OPENAI_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.")
        client = OpenAI(api_key=api_key)
    return client


def diagnose_idea(idea: str, target: str, problem: str) -> dict:
    """
    아이디어 진단 — OpenAI API 호출

    Returns:
        {
            "strengths": [...],
            "risks": [...],
            "suggestions": [...],
            "summary": "..."
        }
    """
    system_prompt = """당신은 청년 예비창업자를 위한 AI 창업 코치입니다.
사용자가 창업 아이디어를 입력하면, 시장성·경쟁·타깃 적합성을 분석하여 피드백합니다.

반드시 지켜야 할 규칙:
- "성공 가능성 N%" 같은 단정적 수치를 사용하지 마세요.
- "반드시 성공합니다" 같은 과장 표현을 하지 마세요.
- 분석은 참고용이라는 점을 전제하세요.
- 한국어로 답변하세요.

응답은 반드시 아래 JSON 형식으로만 반환하세요 (다른 텍스트 없이):
{
  "strengths": ["강점1", "강점2", "강점3"],
  "risks": ["리스크1", "리스크2", "리스크3"],
  "suggestions": ["제안1", "제안2", "제안3"],
  "summary": "한 줄 요약"
}"""

    user_prompt = f"""아이디어: {idea}
타깃 고객: {target}
해결하려는 문제: {problem}

위 아이디어를 분석해주세요."""

    try:
        response = get_client().chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=1000,
        )

        content = response.choices[0].message.content.strip()

        # JSON 파싱 (```json ... ``` 감싸진 경우 처리)
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
            content = content.strip()

        result = json.loads(content)
        return result

    except json.JSONDecodeError:
        # AI 응답이 JSON이 아닌 경우 폴백
        return get_fallback_diagnosis(idea, target)
    except RuntimeError:
        # API 키 미설정 시 폴백
        return get_fallback_diagnosis(idea, target)
    except Exception:
        return get_fallback_diagnosis(idea, target)


def generate_plan(idea: str, target: str, problem: str, diagnosis_summary: str) -> list:
    """
    사업계획서 초안 생성 — OpenAI API 호출

    Returns:
        [
            {"title": "문제 정의", "content": "...", "isAIGenerated": true},
            ...
        ]
    """
    system_prompt = """당신은 청년 예비창업자를 위한 사업계획서 작성 보조 AI입니다.
아이디어와 진단 결과를 바탕으로 사업계획서 초안을 5개 섹션으로 작성합니다.

반드시 지켜야 할 규칙:
- "반드시 성공" 등 단정적·과장 표현 금지
- 시장 수치에는 "추정", "참고용" 등 불확실성 표기
- 구체적이고 실행 가능한 내용으로 작성
- 한국어로 답변

응답은 반드시 아래 JSON 배열 형식으로만 반환하세요:
[
  {"title": "문제 정의", "content": "..."},
  {"title": "해결 방안", "content": "..."},
  {"title": "시장 분석", "content": "..."},
  {"title": "수익 모델", "content": "..."},
  {"title": "팀 구성", "content": "..."}
]"""

    user_prompt = f"""아이디어: {idea}
타깃 고객: {target}
해결하려는 문제: {problem}
진단 요약: {diagnosis_summary if diagnosis_summary else "없음"}

위 내용을 바탕으로 사업계획서 초안을 작성해주세요."""

    try:
        response = get_client().chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=2500,
        )

        content = response.choices[0].message.content.strip()

        # JSON 파싱
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
            content = content.strip()

        sections = json.loads(content)

        # isAIGenerated 플래그 추가
        for section in sections:
            section["isAIGenerated"] = True

        return sections

    except json.JSONDecodeError:
        return get_fallback_plan(idea, target, problem)
    except RuntimeError:
        return get_fallback_plan(idea, target, problem)
    except Exception:
        return get_fallback_plan(idea, target, problem)


# ──────────────────────────────────────────────
# 폴백 (API 키 없거나 호출 실패 시)
# ──────────────────────────────────────────────

def get_fallback_diagnosis(idea: str, target: str) -> dict:
    """API 키 없을 때 사용하는 폴백 진단 결과"""
    return {
        "summary": f'"{idea}" 아이디어에 대한 AI 진단 결과입니다.',
        "strengths": [
            f"{target}을(를) 타깃으로 한 명확한 사용자 정의",
            "관련 분야 시장이 지속 성장 중",
            "비용 장벽을 낮추는 접근으로 사회적 가치 확보 가능",
        ],
        "risks": [
            "유사 서비스가 이미 시장에 다수 존재할 수 있음",
            "타깃 사용자와 결제 주체가 분리될 가능성",
            "초기 콘텐츠 품질 확보에 비용 발생 가능",
        ],
        "suggestions": [
            "타깃을 더 좁혀서 차별점을 명확히 해보세요",
            "기존 서비스 대비 차별점을 한 줄로 정리해보세요",
            "핵심 사용자 10명에게 직접 인터뷰해보는 것을 권장합니다",
        ],
    }


def get_fallback_plan(idea: str, target: str, problem: str) -> list:
    """API 키 없을 때 사용하는 폴백 사업계획서 초안"""
    return [
        {
            "title": "문제 정의",
            "content": f"{target}은(는) {problem}라는 문제를 겪고 있습니다.\n\n"
                       "기존 해결책은 비용이 높거나 접근성이 낮아, 상당수의 잠재 사용자가 "
                       "적절한 서비스를 이용하지 못하고 있습니다.",
            "isAIGenerated": True,
        },
        {
            "title": "해결 방안",
            "content": f"{idea}을(를) 통해 위 문제를 해결합니다.\n\n"
                       "핵심 기능:\n"
                       "• AI 기반 맞춤형 서비스 제공\n"
                       "• 시간·장소 제약 없는 접근성\n"
                       "• 기존 대비 저렴한 가격 구조",
            "isAIGenerated": True,
        },
        {
            "title": "시장 분석",
            "content": "관련 시장은 지속 성장하고 있으며, 특히 AI 기반 서비스 분야의 성장세가 두드러집니다.\n\n"
                       "• 타깃 시장: 구체적 규모 조사 필요\n"
                       "• 경쟁 서비스: 유사 서비스 분석 필요\n"
                       "• 차별점: [직접 작성 필요]\n\n"
                       "※ 위 내용은 참고용이며, 실제 시장 조사를 통해 검증이 필요합니다.",
            "isAIGenerated": True,
        },
        {
            "title": "수익 모델",
            "content": "프리미엄 구독 모델(Freemium)을 기본 수익 구조로 설계합니다.\n\n"
                       "• 무료 플랜: 기본 기능 제한 제공\n"
                       "• 프리미엄 플랜: 월 구독 (가격 미정)\n"
                       "• B2B 모델: 기관 대상 단체 라이선스\n\n"
                       "초기에는 B2C로 시작하고, 사용자 확보 후 B2B로 확장합니다.",
            "isAIGenerated": True,
        },
        {
            "title": "팀 구성",
            "content": "• 대표/기획: [이름 및 역할 작성]\n"
                       "• 개발 (프론트엔드): [이름 및 역할 작성]\n"
                       "• 개발 (백엔드/AI): [이름 및 역할 작성]\n"
                       "• 데이터/QA: [이름 및 역할 작성]\n\n"
                       "[직접 작성을 권장합니다]",
            "isAIGenerated": True,
        },
    ]
