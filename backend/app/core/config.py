from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """애플리케이션 환경설정.

    실제 비밀값은 .env에만 두고 저장소에는 커밋하지 않습니다.
    """

    app_name: str = "AI 창업 코파일럿 API"
    app_version: str = "0.1.0"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    openai_api_key: str | None = Field(default=None, repr=False)
    openai_model: str = "gpt-5.6"
    openai_timeout_seconds: float = 30.0

    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
