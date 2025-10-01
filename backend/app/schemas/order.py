from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class OrderItemBase(BaseModel):
    product_id: int
    quantity: int


class OrderItemCreate(OrderItemBase):
    pass


class OrderItemResponse(OrderItemBase):
    id: int
    unit_price: float
    subtotal: float
    
    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    customer_id: int
    notes: Optional[str] = None


class OrderCreate(OrderBase):
    items: List[OrderItemCreate]


class OrderUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


class OrderResponse(OrderBase):
    id: int
    status: str
    total_amount: float
    created_at: datetime
    updated_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    items: List[OrderItemResponse] = []
    
    class Config:
        from_attributes = True