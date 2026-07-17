"""
애플리케이션 환경설정 — pydantic_settings 기반
.env 파일에서 자동 로드됩니다.
"""

from functools import lru_cache
from typing import List, Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """앱 전역 환경설정. 비밀값은 .env에만 두고 저장소에 커밋하지 않습니다."""

    app_name: str = "Startup Copilot API"
    app_version: str = "0.1.0"
    debug: bool = False

    # OpenAI
    openai_api_key: Optional[str] = Field(default=None, repr=False)
    openai_model: str = "gpt-4o-mini"
    openai_timeout_seconds: float = 30.0

    # CORS
    cors_origins: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
