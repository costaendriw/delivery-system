from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1 import api_router
from app.utils.scheduler import reminder_scheduler

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Gerencia o ciclo de vida da aplicação
    """
    # Startup
    logger.info("Iniciando aplicação...")
    
    # Cria tabelas no banco de dados
    Base.metadata.create_all(bind=engine)
    logger.info("Tabelas do banco de dados verificadas/criadas")
    
    # Inicia o agendador de lembretes
    reminder_scheduler.start()
    
    yield
    
    # Shutdown
    logger.info("Finalizando aplicação...")
    reminder_scheduler.shutdown()


# Cria instância do FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    description="API para gerenciamento de entregas de gás e água",
    version="1.0.0",
    lifespan=lifespan
)

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui rotas da API v1
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root():
    """
    Rota raiz da API
    """
    return {
        "message": "Bem-vindo à API de Gerenciamento de Entregas",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """
    Verifica se a API está funcionando
    """
    return {"status": "healthy"}