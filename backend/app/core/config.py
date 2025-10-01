from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # WhatsApp
    WHATSAPP_API_URL: str
    WHATSAPP_API_TOKEN: str
    WHATSAPP_PHONE_NUMBER_ID: str
    
    # Application
    APP_NAME: str = "Delivery Management System"
    DEBUG: bool = False
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173"
    
    # Scheduler
    SCHEDULER_ENABLED: bool = True
    REMINDER_CHECK_HOUR: int = 9
    REMINDER_CHECK_MINUTE: int = 0
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    @property
    def origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]


settings = Settings()