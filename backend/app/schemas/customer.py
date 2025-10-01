from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CustomerBase(BaseModel):
    name: str
    phone: str
    address: str
    consumption_pattern_days: int = 30


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    consumption_pattern_days: Optional[int] = None


class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True