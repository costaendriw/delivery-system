from sqlalchemy.orm import Session
from datetime import datetime
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.customer import Customer
from app.schemas.order import OrderCreate
from app.services.whatsapp import whatsapp_service
from fastapi import HTTPException, status


class OrderService:
    """
    Serviço para lógica de negócios relacionada a pedidos
    """
    
    @staticmethod
    async def create_order(db: Session, order_data: OrderCreate) -> Order:
        """
        Cria um novo pedido e envia confirmação via WhatsApp
        """
        # Verifica se o cliente existe
        customer = db.query(Customer).filter(Customer.id == order_data.customer_id).first()
        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cliente não encontrado"
            )
        
        # Cria o pedido
        order = Order(
            customer_id=order_data.customer_id,
            notes=order_data.notes,
            status="novo"
        )
        db.add(order)
        db.flush()
        
        total_amount = 0.0
        items_for_message = []
        
        # Adiciona itens ao pedido
        for item_data in order_data.items:
            product = db.query(Product).filter(Product.id == item_data.product_id).first()
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Produto {item_data.product_id} não encontrado"
                )
            
            if not product.is_active:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Produto {product.name} não está disponível"
                )
            
            subtotal = product.price * item_data.quantity
            total_amount += subtotal
            
            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=item_data.quantity,
                unit_price=product.price,
                subtotal=subtotal
            )
            db.add(order_item)
            
            items_for_message.append({
                "product_name": product.name,
                "quantity": item_data.quantity
            })
            
            # Atualiza estoque
            product.stock_quantity -= item_data.quantity
        
        order.total_amount = total_amount
        db.commit()
        db.refresh(order)
        
        # Envia confirmação via WhatsApp
        await whatsapp_service.send_order_confirmation(
            customer_name=customer.name,
            customer_phone=customer.phone,
            order_id=order.id,
            items=items_for_message,
            total=total_amount
        )
        
        return order
    
    @staticmethod
    async def complete_order(db: Session, order_id: int) -> Order:
        """
        Marca pedido como concluído e envia confirmação de entrega
        """
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pedido não encontrado"
            )
        
        order.status = "concluido"
        order.delivered_at = datetime.utcnow()
        db.commit()
        db.refresh(order)
        
        # Envia confirmação de entrega via WhatsApp
        customer = order.customer
        await whatsapp_service.send_delivery_confirmation(
            customer_name=customer.name,
            customer_phone=customer.phone,
            order_id=order.id
        )
        
        return order
    
    @staticmethod
    def get_customer_orders(db: Session, customer_id: int):
        """
        Retorna histórico de pedidos de um cliente
        """
        return db.query(Order).filter(Order.customer_id == customer_id).order_by(Order.created_at.desc()).all()


order_service = OrderService()