# 🚚 Sistema de Gerenciamento de Entregas - Backend

Backend completo para sistema de gerenciamento de entregas de **gás e água** com integração WhatsApp.

## 🚀 Tecnologias

- **Python 3.11+**
- **FastAPI** - Framework web moderno e rápido
- **PostgreSQL** - Banco de dados relacional
- **SQLAlchemy** - ORM
- **Alembic** - Migrações de banco de dados
- **JWT** - Autenticação segura
- **WhatsApp Business API** - Notificações automáticas
- **APScheduler** - Agendamento de tarefas

## 📁 Estrutura do Projeto

```
backend/
├── app/
│   ├── api/v1/          # Endpoints da API
│   ├── core/            # Configurações e segurança
│   ├── models/          # Modelos do banco de dados
│   ├── schemas/         # Schemas Pydantic
│   ├── services/        # Lógica de negócios
│   ├── utils/           # Utilitários (scheduler)
│   └── main.py          # Ponto de entrada
├── migrations/          # Migrações Alembic
├── tests/              # Testes automatizados
├── requirements.txt
└── .env
```

## ⚙️ Instalação

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd backend
```

### 2. Crie um ambiente virtual

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows
```

### 3. Instale as dependências

```bash
pip install -r requirements.txt
```

### 4. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/delivery_db
SECRET_KEY=sua-chave-secreta-aqui
WHATSAPP_API_URL=https://waba.360dialog.io/v1/messages
WHATSAPP_API_TOKEN=seu-token-aqui
WHATSAPP_PHONE_NUMBER_ID=seu-id-aqui
```

### 5. Configure o banco de dados

Crie o banco de dados PostgreSQL:

```bash
createdb delivery_db
```

### 6. Execute as migrações

```bash
# Inicializa o Alembic (apenas primeira vez)
alembic init migrations

# Cria migração automática
alembic revision --autogenerate -m "Initial migration"

# Aplica migrações
alembic upgrade head
```

### 7. Inicie o servidor

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

A API estará disponível em: `http://localhost:8000`

## 📚 Documentação da API

Acesse a documentação interativa (Swagger):
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação.

### Fluxo de autenticação:

1. **Registrar usuário**: `POST /api/v1/auth/register`
2. **Login**: `POST /api/v1/auth/login` (retorna token)
3. **Usar token**: Incluir header `Authorization: Bearer <token>` nas requisições

## 📱 Integração WhatsApp

### Configuração

O sistema suporta três provedores de WhatsApp Business API:

1. **360Dialog** (recomendado)
2. **Twilio**
3. **WhatsApp Business API oficial**

### Mensagens automáticas:

- ✅ Confirmação de pedido
- 🚚 Confirmação de entrega
- 🔔 Lembretes automáticos (baseados no padrão de consumo)

### Configurar 360Dialog:

1. Crie conta em https://www.360dialog.com
2. Obtenha API Token e Phone Number ID
3. Configure no `.env`:

```env
WHATSAPP_API_URL=https://waba.360dialog.io/v1/messages
WHATSAPP_API_TOKEN=seu_token_aqui
WHATSAPP_PHONE_NUMBER_ID=seu_id_aqui
```

## 🤖 Agendador Automático

O sistema possui um agendador que verifica diariamente os clientes que precisam de lembretes.

**Funcionamento:**
- Verifica último pedido concluído
- Calcula dias desde a última entrega
- Envia lembrete 3 dias antes do padrão de consumo

**Configuração no `.env`:**

```env
SCHEDULER_ENABLED=True
REMINDER_CHECK_HOUR=9
REMINDER_CHECK_MINUTE=0
```

## 🧪 Testes

Execute os testes automatizados:

```bash
pytest
```

Execute com cobertura:

```bash
pytest --cov=app tests/
```

## 📊 Endpoints Principais

### Autenticação
- `POST /api/v1/auth/register` - Registrar usuário
- `POST /api/v1/auth/login` - Login

### Clientes
- `GET /api/v1/customers/` - Listar clientes
- `POST /api/v1/customers/` - Criar cliente
- `GET /api/v1/customers/{id}` - Buscar cliente
- `PUT /api/v1/customers/{id}` - Atualizar cliente
- `DELETE /api/v1/customers/{id}` - Excluir cliente

### Produtos
- `GET /api/v1/products/` - Listar produtos
- `POST /api/v1/products/` - Criar produto
- `GET /api/v1/products/{id}` - Buscar produto
- `PUT /api/v1/products/{id}` - Atualizar produto
- `DELETE /api/v1/products/{id}` - Excluir produto

### Pedidos
- `GET /api/v1/orders/` - Listar pedidos
- `POST /api/v1/orders/` - Criar pedido (envia WhatsApp)
- `GET /api/v1/orders/{id}` - Buscar pedido
- `PUT /api/v1/orders/{id}` - Atualizar pedido
- `POST /api/v1/orders/{id}/complete` - Concluir entrega (envia WhatsApp)
- `GET /api/v1/orders/customer/{id}/history` - Histórico do cliente

## 🛡️ Segurança

- Senhas criptografadas com bcrypt
- Tokens JWT com expiração
- CORS configurado
- Validação de dados com Pydantic
- SQL Injection protegido pelo SQLAlchemy

## 🚀 Deploy

### Docker (recomendado)

Crie um `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Deploy em produção

Configure as variáveis de ambiente:
- Use `DEBUG=False`
- Gere uma `SECRET_KEY` forte
- Configure HTTPS
- Use PostgreSQL em servidor dedicado

## 📝 Licença

Este projeto é de código aberto.

## 👥 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.