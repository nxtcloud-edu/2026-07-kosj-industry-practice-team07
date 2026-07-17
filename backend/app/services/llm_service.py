from functools import lru_cache
from typing import TypeVar

from openai import APIConnectionError, APIStatusError, AsyncOpenAI, RateLimitError
from pydantic import BaseModel

from app.core.config import Settings, get_settings
from app.prompts.business_plan_prompt import (
    BUSINESS_PLAN_SYSTEM_PROMPT,
    build_business_plan_user_prompt,
)
from app.prompts.diagnosis_prompt import (
    DIAGNOSIS_SYSTEM_PROMPT,
    build_diagnosis_user_prompt,
)
from app.schemas.business_plan import BusinessPlanRequest, BusinessPlanResponse
from app.schemas.diagnosis import DiagnosisRequest, DiagnosisResponse

ResponseModelT = TypeVar("ResponseModelT", bound=BaseModel)


class LLMServiceError(RuntimeError):
    def __init__(self, message: str, status_code: int = 502) -> None:
        super().__init__(message)
        self.status_code = status_code


class LLMService:
    """OpenAI Responses API 호출을 캡슐화합니다.

    사용자 아이디어 원문은 이 서비스에서 로깅하거나 저장하지 않습니다.
    """

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self._client: AsyncOpenAI | None = None

    @property
    def client(self) -> AsyncOpenAI:
        if not self.settings.openai_api_key:
            raise LLMServiceError(
                "OPENAI_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.",
                status_code=503,
            )

        if self._client is None:
            self._client = AsyncOpenAI(
                api_key=self.settings.openai_api_key,
                timeout=self.settings.openai_timeout_seconds,
            )
        return self._client

    async def diagnose(self, request: DiagnosisRequest) -> DiagnosisResponse:
        return await self._parse_structured(
            system_prompt=DIAGNOSIS_SYSTEM_PROMPT,
            user_prompt=build_diagnosis_user_prompt(request),
            response_model=DiagnosisResponse,
        )

    async def generate_business_plan(
        self, request: BusinessPlanRequest
    ) -> BusinessPlanResponse:
        return await self._parse_structured(
            system_prompt=BUSINESS_PLAN_SYSTEM_PROMPT,
            user_prompt=build_business_plan_user_prompt(request),
            response_model=BusinessPlanResponse,
        )

    async def _parse_structured(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
        response_model: type[ResponseModelT],
    ) -> ResponseModelT:
        try:
            response = await self.client.responses.parse(
                model=self.settings.openai_model,
                input=[
                    {"role": "developer", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                text_format=response_model,
            )
        except RateLimitError as exc:
            raise LLMServiceError(
                "AI 요청 한도를 초과했습니다. 잠시 후 다시 시도하세요.", 429
            ) from exc
        except APIConnectionError as exc:
            raise LLMServiceError(
                "AI 서비스에 연결할 수 없습니다. 네트워크 상태를 확인하세요.", 502
            ) from exc
        except APIStatusError as exc:
            raise LLMServiceError(
                f"AI 서비스가 오류를 반환했습니다. (status={exc.status_code})", 502
            ) from exc
        except Exception as exc:
            raise LLMServiceError("AI 응답 처리 중 오류가 발생했습니다.", 502) from exc

        parsed = response.output_parsed
        if parsed is None:
            raise LLMServiceError("AI가 구조화된 결과를 생성하지 못했습니다.", 502)

        # 타입 체커와 런타임 양쪽에서 응답 스키마를 다시 보장합니다.
        if isinstance(parsed, response_model):
            return parsed
        return response_model.model_validate(parsed)


@lru_cache
def get_llm_service() -> LLMService:
    return LLMService(get_settings())
