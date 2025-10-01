from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime, timedelta
from app.models.customer import Customer
from app.models.order import Order
from app.services.whatsapp import whatsapp_service


class NotificationService:
    """
    Serviço para gerenciar notificações e lembretes automáticos
    """
    
    @staticmethod
    async def check_and_send_reminders(db: Session):
        """
        Verifica clientes que precisam de lembrete e envia mensagem
        """
        customers = db.query(Customer).all()
        reminders_sent = 0
        
        for customer in customers:
            # Busca último pedido concluído do cliente
            last_order = db.query(Order).filter(
                and_(
                    Order.customer_id == customer.id,
                    Order.status == "concluido",
                    Order.delivered_at.isnot(None)
                )
            ).order_by(Order.delivered_at.desc()).first()
            
            if not last_order:
                continue
            
            # Calcula dias desde a última entrega
            days_since_delivery = (datetime.utcnow() - last_order.delivered_at).days
            
            # Calcula quando deve enviar o lembrete (3 dias antes do padrão de consumo)
            reminder_threshold = customer.consumption_pattern_days - 3
            
            if days_since_delivery >= reminder_threshold:
                # Calcula dias restantes estimados
                days_remaining = customer.consumption_pattern_days - days_since_delivery
                
                if days_remaining < 0:
                    days_remaining = 0
                
                # Envia lembrete
                result = await whatsapp_service.send_reminder(
                    customer_name=customer.name,
                    customer_phone=customer.phone,
                    days_until_estimated=days_remaining
                )
                
                if result.get("success"):
                    reminders_sent += 1
        
        return {
            "reminders_sent": reminders_sent,
            "timestamp": datetime.utcnow()
        }


notification_service = NotificationService()