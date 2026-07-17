"""
OpenAI API 호출 로직 — 비동기 + 에러 핸들링 + 폴백
효재의 구조(AsyncOpenAI, 에러 세분화)와 건우의 폴백 로직을 병합
"""

import json
from typing import Optional, Union

from openai import (
    APIConnectionError,
    APIStatusError,
    AsyncOpenAI,
    RateLimitError,
)

from app.core.config import Settings, get_settings
from app.prompts.diagnosis_prompt import DIAGNOSIS_SYSTEM_PROMPT, build_diagnosis_user_prompt
from app.prompts.plan_prompt import PLAN_SYSTEM_PROMPT, build_plan_user_prompt


class LLMServiceError(RuntimeError):
    """AI 서비스 호출 중 발생하는 에러"""

    def __init__(self, message: str, status_code: int = 502) -> None:
        super().__init__(message)
        self.status_code = status_code


class AIService:
    """OpenAI API 호출을 캡슐화.

    - API 키가 없으면 폴백 응답 반환 (개발 중 프론트 테스트 가능)
    - API 키가 있으면 실제 호출
    - 사용자 아이디어 원문은 로깅/저장하지 않음
    """

    def __init__(self, settings: Optional[Settings] = None) -> None:
        self.settings = settings or get_settings()
        self._client: Optional[AsyncOpenAI] = None

    @property
    def _has_valid_key(self) -> bool:
        key = self.settings.openai_api_key
        return key is not None and not key.startswith("sk-your")

    @property
    def client(self) -> AsyncOpenAI:
        if self._client is None:
            self._client = AsyncOpenAI(
                api_key=self.settings.openai_api_key or "",
                timeout=self.settings.openai_timeout_seconds,
            )
        return self._client

    async def diagnose_idea(self, idea: str, target: str, problem: str) -> dict:
        """아이디어 진단 — AI 호출 또는 폴백"""
        if not self._has_valid_key:
            return _fallback_diagnosis(idea, target)

        user_prompt = build_diagnosis_user_prompt(idea, target, problem)
        return await self._call_llm(
            system_prompt=DIAGNOSIS_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            fallback_fn=lambda: _fallback_diagnosis(idea, target),
        )

    async def generate_plan(
        self, idea: str, target: str, problem: str, diagnosis_summary: str
    ) -> list:
        """사업계획서 초안 생성 — AI 호출 또는 폴백"""
        if not self._has_valid_key:
            return _fallback_plan(idea, target, problem)

        user_prompt = build_plan_user_prompt(idea, target, problem, diagnosis_summary)
        result = await self._call_llm(
            system_prompt=PLAN_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            fallback_fn=lambda: _fallback_plan(idea, target, problem),
        )

        # list가 아닌 경우 폴백
        if not isinstance(result, list):
            return _fallback_plan(idea, target, problem)

        # isAIGenerated 플래그 추가
        for section in result:
            section["isAIGenerated"] = True
        return result

    async def _call_llm(self, *, system_prompt: str, user_prompt: str, fallback_fn):
        """공통 LLM 호출 로직 — 에러 시 폴백 반환"""
        try:
            response = await self.client.chat.completions.create(
                model=self.settings.openai_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.7,
                max_tokens=2500,
            )

            content = response.choices[0].message.content.strip()

            # ```json ... ``` 감싸진 경우 처리
            if content.startswith("```"):
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]
                content = content.strip()

            return json.loads(content)

        except RateLimitError:
            raise LLMServiceError(
                "AI 요청 한도를 초과했습니다. 잠시 후 다시 시도하세요.", 429
            )
        except APIConnectionError:
            raise LLMServiceError(
                "AI 서비스에 연결할 수 없습니다. 네트워크 상태를 확인하세요.", 502
            )
        except APIStatusError as exc:
            raise LLMServiceError(
                f"AI 서비스가 오류를 반환했습니다. (status={exc.status_code})", 502
            )
        except json.JSONDecodeError:
            # AI 응답이 JSON이 아닌 경우 폴백
            return fallback_fn()
        except Exception:
            return fallback_fn()


# ──────────────────────────────────────────────
# 싱글턴
# ──────────────────────────────────────────────

_service_instance: Optional[AIService] = None


def get_ai_service() -> AIService:
    global _service_instance
    if _service_instance is None:
        _service_instance = AIService()
    return _service_instance


# ──────────────────────────────────────────────
# 폴백 응답 (API 키 없거나 호출 실패 시)
# ──────────────────────────────────────────────

def _fallback_diagnosis(idea: str, target: str) -> dict:
    return {
        "summary": f'"{idea}" 아이디어에 대한 AI 진단 결과입니다.',
        "strengths": [
            f"{target}을(를) 타깃으로 한 명확한 사용자 정의",
            "관련 분야 시장이 지속 성장 중 (추정, 검증 필요)",
            "비용 장벽을 낮추는 접근으로 사회적 가치 확보 가능",
        ],
        "risks": [
            "유사 서비스가 이미 시장에 다수 존재할 수 있음 (경쟁 조사 필요)",
            "타깃 사용자와 결제 주체가 분리될 가능성",
            "초기 콘텐츠/서비스 품질 확보에 비용 발생 가능",
        ],
        "suggestions": [
            "타깃을 더 좁혀서 차별점을 명확히 해보세요",
            "기존 서비스 대비 차별점을 한 줄로 정리해보세요",
            "핵심 사용자 10명에게 직접 인터뷰해보는 것을 권장합니다",
        ],
    }


def _fallback_plan(idea: str, target: str, problem: str) -> list:
    return [
        {
            "title": "문제 정의",
            "content": (
                f"{target}은(는) {problem}라는 문제를 겪고 있습니다.\n\n"
                "기존 해결책은 비용이 높거나 접근성이 낮아, 상당수의 잠재 사용자가 "
                "적절한 서비스를 이용하지 못하고 있습니다.\n\n"
                "※ 위 내용은 가설이며, 실제 사용자 인터뷰를 통해 검증이 필요합니다."
            ),
            "isAIGenerated": True,
        },
        {
            "title": "해결 방안",
            "content": (
                f"{idea}을(를) 통해 위 문제를 해결합니다.\n\n"
                "핵심 기능:\n"
                "• AI 기반 맞춤형 서비스 제공\n"
                "• 시간·장소 제약 없는 접근성\n"
                "• 기존 대비 저렴한 가격 구조\n\n"
                "※ 차별화 포인트와 기술 실현 가능성을 추가로 검증하세요."
            ),
            "isAIGenerated": True,
        },
        {
            "title": "시장 분석",
            "content": (
                "관련 시장은 성장 추세로 추정되며, AI 기반 서비스 분야의 성장세가 두드러집니다.\n\n"
                "• 타깃 시장: 구체적 규모 조사 필요\n"
                "• 경쟁 서비스: 유사 서비스 분석 필요\n"
                "• 차별점: [직접 작성 필요]\n\n"
                "※ 위 내용은 참고용 가설이며, 실제 시장 조사를 통해 검증이 필요합니다."
            ),
            "isAIGenerated": True,
        },
        {
            "title": "수익 모델",
            "content": (
                "프리미엄 구독 모델(Freemium)을 기본 수익 구조로 설계합니다.\n\n"
                "• 무료 플랜: 기본 기능 제한 제공\n"
                "• 프리미엄 플랜: 월 구독 (가격 미정, 사용자 지불의향 조사 필요)\n"
                "• B2B 모델: 기관 대상 단체 라이선스 (확장 단계)\n\n"
                "※ 초기에는 B2C로 시작하고, 수요 검증 후 B2B로 확장합니다."
            ),
            "isAIGenerated": True,
        },
        {
            "title": "팀 구성",
            "content": (
                "• 대표/기획: [이름 및 역할 작성]\n"
                "• 개발 (프론트엔드): [이름 및 역할 작성]\n"
                "• 개발 (백엔드/AI): [이름 및 역할 작성]\n"
                "• 데이터/QA: [이름 및 역할 작성]\n\n"
                "[직접 작성을 권장합니다]"
            ),
            "isAIGenerated": True,
        },
    ]
