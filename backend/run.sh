#!/bin/bash

# Script para iniciar o servidor de desenvolvimento

echo "🚀 Iniciando servidor FastAPI..."
echo ""

# Ativa ambiente virtual se existir
if [ -d "venv" ]; then
    echo "✓ Ativando ambiente virtual..."
    source venv/bin/activate
fi

# Verifica se o arquivo .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "Copiando .env.example para .env..."
    cp .env.example .env
    echo "⚠️  Configure o arquivo .env antes de continuar!"
    exit 1
fi

# Executa migrações
echo "✓ Aplicando migrações do banco de dados..."
alembic upgrade head

# Inicia o servidor
echo ""
echo "✓ Iniciando servidor em http://localhost:8000"
echo "✓ Documentação disponível em http://localhost:8000/docs"
echo ""

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000