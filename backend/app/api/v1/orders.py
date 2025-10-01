from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.order import Order
from app.models.user import User
from app.schemas.order import OrderCreate, OrderUpdate, OrderResponse
from app.services.orders import order_service

router = APIRouter()


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cria um novo pedido e envia confirmação via WhatsApp
    """
    order = await order_service.create_order(db, order_data)
    return order


@router.get("/", response_model=List[OrderResponse])
def list_orders(
    skip: int = 0,
    limit: int = 100,
    status_filter: str = None,
    customer_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lista todos os pedidos com filtros opcionais
    """
    query = db.query(Order)
    
    if status_filter:
        query = query.filter(Order.status == status_filter)
    
    if customer_id:
        query = query.filter(Order.customer_id == customer_id)
    
    orders = query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    return orders


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Busca pedido por ID
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido não encontrado"
        )
    return order


@router.put("/{order_id}", response_model=OrderResponse)
def update_order(
    order_id: int,
    order_data: OrderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Atualiza status ou observações do pedido
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido não encontrado"
        )
    
    update_data = order_data.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(order, field, value)
    
    db.commit()
    db.refresh(order)
    
    return order


@router.post("/{order_id}/complete", response_model=OrderResponse)
async def complete_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Marca pedido como concluído e envia confirmação de entrega via WhatsApp
    """
    order = await order_service.complete_order(db, order_id)
    return order


@router.get("/customer/{customer_id}/history", response_model=List[OrderResponse])
def get_customer_order_history(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retorna histórico de pedidos de um cliente
    """
    orders = order_service.get_customer_orders(db, customer_id)
    return orders


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Exclui um pedido (use com cuidado!)
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido não encontrado"
        )
    
    db.delete(order)
    db.commit()
    
    return None