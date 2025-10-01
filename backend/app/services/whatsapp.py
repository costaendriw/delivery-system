import httpx
from app.core.config import settings
from typing import Optional


class WhatsAppService:
    """
    Serviço para integração com WhatsApp Business API
    Compatível com 360Dialog, Twilio e WhatsApp Business API oficial
    """
    
    def __init__(self):
        self.api_url = settings.WHATSAPP_API_URL
        self.api_token = settings.WHATSAPP_API_TOKEN
        self.phone_number_id = settings.WHATSAPP_PHONE_NUMBER_ID
    
    async def send_message(self, to: str, message: str) -> dict:
        """
        Envia mensagem de texto simples
        
        Args:
            to: Número de telefone do destinatário (formato: 5527999999999)
            message: Texto da mensagem
        
        Returns:
            dict com resposta da API
        """
        # Remove caracteres especiais do número
        to_clean = to.replace("+", "").replace("-", "").replace(" ", "").replace("(", "").replace(")", "")
        
        headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "messaging_product": "whatsapp",
            "to": to_clean,
            "type": "text",
            "text": {
                "body": message
            }
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.api_url,
                    headers=headers,
                    json=payload,
                    timeout=30.0
                )
                response.raise_for_status()
                return {"success": True, "data": response.json()}
        except httpx.HTTPError as e:
            return {"success": False, "error": str(e)}
    
    async def send_order_confirmation(
        self,
        customer_name: str,
        customer_phone: str,
        order_id: int,
        items: list,
        total: float
    ) -> dict:
        """
        Envia confirmação de pedido
        """
        items_text = "\n".join([f"• {item['quantity']}x {item['product_name']}" for item in items])
        
        message = f"""
🎉 *Pedido Confirmado!*

Olá {customer_name}!

Seu pedido #{order_id} foi confirmado com sucesso.

*Itens:*
{items_text}

*Total:* R$ {total:.2f}

Em breve entraremos em contato para agendar a entrega.

Obrigado pela preferência! 🚚
        """.strip()
        
        return await self.send_message(customer_phone, message)
    
    async def send_delivery_confirmation(
        self,
        customer_name: str,
        customer_phone: str,
        order_id: int
    ) -> dict:
        """
        Envia confirmação de entrega
        """
        message = f"""
✅ *Entrega Concluída!*

Olá {customer_name}!

Seu pedido #{order_id} foi entregue com sucesso.

Esperamos que aproveite! Se precisar de algo, estamos à disposição.

Até a próxima! 😊
        """.strip()
        
        return await self.send_message(customer_phone, message)
    
    async def send_reminder(
        self,
        customer_name: str,
        customer_phone: str,
        days_until_estimated: int
    ) -> dict:
        """
        Envia lembrete automático
        """
        message = f"""
🔔 *Lembrete Automático*

Olá {customer_name}!

Estimamos que em aproximadamente {days_until_estimated} dias você precisará de um novo pedido.

Gostaria de fazer um pedido agora? Estamos prontos para atendê-lo! 📞

Responda esta mensagem ou entre em contato conosco.
        """.strip()
        
        return await self.send_message(customer_phone, message)


# Instância singleton
whatsapp_service = WhatsAppService()