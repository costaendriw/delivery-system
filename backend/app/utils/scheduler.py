from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from app.core.config import settings
from app.core.database import SessionLocal
from app.services.notifications import notification_service
import logging

logger = logging.getLogger(__name__)


class ReminderScheduler:
    """
    Agendador para envio automático de lembretes
    """
    
    def __init__(self):
        self.scheduler = AsyncIOScheduler()
    
    async def send_daily_reminders(self):
        """
        Tarefa agendada para enviar lembretes diários
        """
        db = SessionLocal()
        try:
            logger.info("Iniciando verificação de lembretes...")
            result = await notification_service.check_and_send_reminders(db)
            logger.info(f"Lembretes enviados: {result['reminders_sent']}")
        except Exception as e:
            logger.error(f"Erro ao enviar lembretes: {str(e)}")
        finally:
            db.close()
    
    def start(self):
        """
        Inicia o agendador
        """
        if not settings.SCHEDULER_ENABLED:
            logger.info("Agendador desabilitado nas configurações")
            return
        
        # Agenda verificação diária de lembretes
        self.scheduler.add_job(
            self.send_daily_reminders,
            CronTrigger(
                hour=settings.REMINDER_CHECK_HOUR,
                minute=settings.REMINDER_CHECK_MINUTE
            ),
            id="daily_reminders",
            name="Envio de lembretes diários",
            replace_existing=True
        )
        
        self.scheduler.start()
        logger.info(f"Agendador iniciado - Lembretes serão enviados às {settings.REMINDER_CHECK_HOUR}:{settings.REMINDER_CHECK_MINUTE:02d}")
    
    def shutdown(self):
        """
        Para o agendador
        """
        self.scheduler.shutdown()
        logger.info("Agendador finalizado")


# Instância singleton
reminder_scheduler = ReminderScheduler()