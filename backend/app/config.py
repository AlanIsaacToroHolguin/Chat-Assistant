from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    JWT_SECRET: str = "demo-secret-key-change-in-production-32chars"
    JWT_EXPIRE_HOURS: int = 24

    # Demo credentials (shown on login page)
    DEMO_EMAIL: str = "demo@assistant.com"
    DEMO_PASSWORD: str = "demo123"
    DEMO_USERNAME: str = "Demo User"

    AI_PROVIDER: str = "groq"
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"

    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
