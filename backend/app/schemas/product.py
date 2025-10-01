from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    product_type: str  # gas ou water
    stock_quantity: int = 0
    is_active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    product_type: Optional[str] = None
    stock_quantity: Optional[int] = None
    is_active: Optional[bool] = None


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True