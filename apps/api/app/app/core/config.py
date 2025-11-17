from pydantic import BaseSettings

class Settings(BaseSettings):
    GMAPS_KEY: str | None = None
    YELP_KEY: str | None = None
    OPENAI_API_KEY: str | None = None
    CORS_ORIGINS: str = "*"  # set to your Vercel URL in prod

    class Config:
        env_file = ".env"

settings = Settings()
