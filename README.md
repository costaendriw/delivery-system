# 🚚 Sistema de Gerenciamento de Entregas - Gás e Água

Sistema completo para gerenciamento de entregas de gás e água com notificações automáticas via WhatsApp.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![React](https://img.shields.io/badge/react-18.2-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Sobre o Projeto

Sistema web completo para gerenciar entregas de botijões de gás e galões de água, com:

- ✅ **Gestão de Clientes** - Cadastro completo com padrão de consumo
- ✅ **Gestão de Produtos** - Controle de estoque e preços
- ✅ **Gestão de Pedidos** - Criação e acompanhamento de entregas
- ✅ **Notificações WhatsApp** - Confirmações automáticas de pedidos e entregas
- ✅ **Lembretes Inteligentes** - Sistema automático baseado no padrão de consumo
- ✅ **Dashboard** - Visão geral do negócio em tempo real
- ✅ **Autenticação JWT** - Sistema seguro de login

---

## 🛠️ Tecnologias

### Backend
- **Python 3.11+**
- **FastAPI** - Framework web moderno e rápido
- **PostgreSQL** - Banco de dados relacional
- **SQLAlchemy** - ORM
- **Alembic** - Migrações de banco
- **JWT** - Autenticação
- **APScheduler** - Agendador de tarefas

### Frontend
- **React 18** - Biblioteca JavaScript
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **TailwindCSS** - Framework CSS
- **Axios** - Cliente HTTP
- **React Router** - Roteamento
- **React Hook Form** - Formulários

---

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado:

### Obrigatórios:

- **Python 3.11 ou superior** - [Download](https://www.python.org/downloads/)
- **Node.js 18 ou superior** - [Download](https://nodejs.org/)
- **PostgreSQL 15 ou superior** - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

### Opcional:

- **pgAdmin** - Interface gráfica para PostgreSQL
- **Postman** - Testar API endpoints

### Verificar Instalações:

```bash
# Python
python --version
# Deve mostrar: Python 3.11.x ou superior

# Node.js
node --version
# Deve mostrar: v18.x.x ou superior

# PostgreSQL
psql --version
# Deve mostrar: psql (PostgreSQL) 15.x ou superior

# Git
git --version
# Deve mostrar: git version 2.x.x
```

---

## 🚀 Instalação e Configuração

### **Passo 1: Clone o Repositório**

```bash
git clone https://github.com/seu-usuario/delivery-system.git
cd delivery-system
```

---

### **Passo 2: Configure o Backend**

#### 2.1 - Entre na pasta do backend:

```bash
cd backend
```

#### 2.2 - Crie o ambiente virtual Python:

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```cmd
python -m venv venv
venv\Scripts\activate.bat
```

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

✅ **Você verá `(venv)` no início da linha do terminal**

#### 2.3 - Instale as dependências:

```bash
pip install -r requirements.txt
```

⏱️ **Isso pode levar alguns minutos...**

#### 2.4 - Configure o PostgreSQL:

**Opção A - Via psql (Terminal):**
```bash
psql -U postgres
CREATE DATABASE delivery_db;
\q
```

**Opção B - Via pgAdmin:**
1. Abra o pgAdmin
2. Clique com botão direito em "Databases"
3. Create → Database
4. Nome: `delivery_db`
5. Save

#### 2.5 - Configure as variáveis de ambiente:

Crie um arquivo `.env` na pasta `backend/`:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Mac/Linux
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database (IMPORTANTE: ajuste usuário e senha)
DATABASE_URL=postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/delivery_db

# JWT (gere uma chave forte)
SECRET_KEY=sua-chave-secreta-super-forte-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# WhatsApp API (opcional por enquanto)
WHATSAPP_API_URL=https://waba.360dialog.io/v1/messages
WHATSAPP_API_TOKEN=seu-token-aqui
WHATSAPP_PHONE_NUMBER_ID=seu-id-aqui

# Application
APP_NAME=Delivery Management System
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Scheduler
SCHEDULER_ENABLED=True
REMINDER_CHECK_HOUR=9
REMINDER_CHECK_MINUTE=0
```

**🔐 Gerar SECRET_KEY forte:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copie o resultado e cole no `.env` no campo `SECRET_KEY`

#### 2.6 - Execute as migrações do banco:

```bash
alembic upgrade head
```

✅ **Se aparecer "Running upgrade ... -> ..., OK!"** está correto!

---

### **Passo 3: Configure o Frontend**

#### 3.1 - Abra um NOVO terminal e entre na pasta frontend:

```bash
cd frontend
```

⚠️ **IMPORTANTE: Não feche o terminal do backend!**

#### 3.2 - Instale as dependências:

```bash
npm install
```

⏱️ **Isso pode levar alguns minutos...**

#### 3.3 - Configure as variáveis de ambiente:

Crie um arquivo `.env` na pasta `frontend/`:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Mac/Linux
cp .env.example .env
```

Edite o arquivo `.env`:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

---

## ▶️ Como Rodar o Projeto

### **Terminal 1 - Backend (FastAPI)**

```bash
# 1. Entre na pasta backend
cd backend

# 2. Ative o ambiente virtual
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# Mac/Linux:
source venv/bin/activate

# 3. Inicie o servidor
uvicorn app.main:app --reload
```

✅ **Você deve ver:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

🌐 **Backend rodando em:** http://localhost:8000  
📚 **Documentação API:** http://localhost:8000/docs

---

### **Terminal 2 - Frontend (React)**

```bash
# 1. Entre na pasta frontend
cd frontend

# 2. Inicie o servidor de desenvolvimento
npm run dev
```

✅ **Você deve ver:**
```
VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

🌐 **Frontend rodando em:** http://localhost:5173

---

## 🎮 Como Usar

### **1. Acesse o Sistema**

Abra seu navegador e acesse: **http://localhost:5173**

Você verá a tela de login.

---

### **2. Crie o Primeiro Usuário**

Como ainda não há usuários no sistema, você precisa criar um:

#### Opção A - Via Swagger (Recomendado):

1. Acesse: **http://localhost:8000/docs**
2. Procure por `POST /api/v1/auth/register`
3. Clique em **"Try it out"**
4. Preencha o JSON:

```json
{
  "email": "admin@empresa.com",
  "full_name": "Administrador",
  "password": "senha123"
}
```

5. Clique em **"Execute"**
6. Se retornar **201 Created**, usuário criado com sucesso! ✅

#### Opção B - Via cURL:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@empresa.com",
    "full_name": "Administrador",
    "password": "senha123"
  }'
```

---

### **3. Faça Login**

1. Volte para: **http://localhost:5173**
2. Digite:
   - **Email:** `admin@empresa.com`
   - **Senha:** `senha123`
3. Clique em **"Entrar"**

✅ **Você será redirecionado para o Dashboard!**

---

### **4. Explore o Sistema**

#### 📊 **Dashboard**
- Visualize estatísticas gerais
- Veja pedidos recentes
- Monitore o status das entregas

#### 👥 **Clientes**
1. Clique em **"Clientes"** no menu lateral
2. Clique em **"Novo Cliente"**
3. Preencha:
   - **Nome:** João Silva
   - **Telefone:** 27999999999
   - **Endereço:** Rua das Flores, 123, Vila Velha - ES
   - **Padrão de consumo:** 30 dias
4. Clique em **"Criar"**

#### 📦 **Produtos**
1. Clique em **"Produtos"**
2. Clique em **"Novo Produto"**
3. Preencha:
   - **Nome:** Botijão de Gás P13
   - **Descrição:** Botijão de gás 13kg
   - **Tipo:** Gás
   - **Preço:** 110.00
   - **Estoque:** 50
   - **Status:** Ativo
4. Clique em **"Criar"**

#### 🛒 **Pedidos**
1. Clique em **"Pedidos"**
2. Clique em **"Novo Pedido"**
3. Selecione o **cliente** criado
4. Clique em **"+ Adicionar Item"**
5. Selecione o **produto** e **quantidade**
6. Adicione **observações** (opcional)
7. Clique em **"Criar Pedido"**

✅ **Pedido criado! WhatsApp enviado automaticamente!** 🎉

#### ✔️ **Concluir Entrega**
1. No pedido criado, clique em **"Iniciar Entrega"**
2. Status muda para **"Em Entrega"**
3. Clique em **"Concluir Entrega"**
4. Status muda para **"Concluído"**
5. WhatsApp de confirmação enviado! 📱

---

## 📁 Estrutura do Projeto

```
delivery-system/
│
├── backend/                      # Backend FastAPI
│   ├── app/
│   │   ├── api/                  # Endpoints da API
│   │   │   └── v1/
│   │   │       ├── auth.py       # Login/Registro
│   │   │       ├── customers.py  # CRUD Clientes
│   │   │       ├── products.py   # CRUD Produtos
│   │   │       ├── orders.py     # CRUD Pedidos
│   │   │       └── users.py      # Usuários
│   │   ├── core/                 # Configurações
│   │   │   ├── config.py         # Variáveis ambiente
│   │   │   ├── database.py       # Conexão DB
│   │   │   └── security.py       # JWT/Auth
│   │   ├── models/               # Modelos ORM
│   │   │   ├── user.py
│   │   │   ├── customer.py
│   │   │   ├── product.py
│   │   │   └── order.py
│   │   ├── schemas/              # Schemas Pydantic
│   │   │   ├── user.py
│   │   │   ├── customer.py
│   │   │   ├── product.py
│   │   │   └── order.py
│   │   ├── services/             # Lógica de negócio
│   │   │   ├── whatsapp.py       # WhatsApp API
│   │   │   ├── orders.py         # Regras pedidos
│   │   │   └── notifications.py  # Lembretes
│   │   ├── utils/                # Utilitários
│   │   │   └── scheduler.py      # Agendador
│   │   └── main.py               # App principal
│   ├── migrations/               # Alembic
│   ├── tests/                    # Testes
│   ├── .env                      # Variáveis (criar)
│   ├── .env.example              # Exemplo
│   ├── requirements.txt          # Dependências Python
│   └── alembic.ini               # Config Alembic
│
├── frontend/                     # Frontend React
│   ├── src/
│   │   ├── components/           # Componentes
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── OrderCard.tsx
│   │   │   └── Loading.tsx
│   │   ├── context/              # Context API
│   │   │   └── AuthContext.tsx   # Autenticação
│   │   ├── hooks/                # Custom Hooks
│   │   │   └── useAuth.ts
│   │   ├── pages/                # Páginas
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Customers.tsx
│   │   │   ├── Products.tsx
│   │   │   └── Orders.tsx
│   │   ├── services/             # API Services
│   │   │   ├── api.ts            # Axios config
│   │   │   ├── auth.ts
│   │   │   ├── customers.ts
│   │   │   ├── products.ts
│   │   │   └── orders.ts
│   │   ├── types/                # TypeScript types
│   │   │   └── index.ts
│   │   ├── utils/                # Utilitários
│   │   │   └── formatters.ts
│   │   ├── App.tsx               # App principal
│   │   ├── main.tsx              # Entry point
│   │   └── index.css             # Estilos globais
│   ├── public/                   # Assets estáticos
│   ├── .env                      # Variáveis (criar)
│   ├── .env.example              # Exemplo
│   ├── package.json              # Dependências Node
│   ├── tsconfig.json             # Config TypeScript
│   ├── vite.config.ts            # Config Vite
│   └── tailwind.config.js        # Config Tailwind
│
├── README.md                     # Este arquivo
├── INTEGRATION_GUIDE.md          # Guia integração
├── TEST_CONNECTION.md            # Testes
└── .gitignore                    # Git ignore
```

---

## 📡 API Endpoints

### Autenticação
- `POST /api/v1/auth/register` - Registrar usuário
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/users/me` - Dados do usuário atual

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
- `POST /api/v1/orders/{id}/complete` - Concluir (envia WhatsApp)
- `GET /api/v1/orders/customer/{id}/history` - Histórico

**📚 Documentação interativa:** http://localhost:8000/docs

---

## 🐛 Troubleshooting

### ❌ Backend não inicia

**Erro: "ModuleNotFoundError"**
```bash
cd backend
pip install -r requirements.txt
```

**Erro: "Database connection failed"**
```bash
# Verifique se PostgreSQL está rodando
# Windows:
Get-Service postgresql*

# Mac/Linux:
ps aux | grep postgres

# Verifique o .env
# DATABASE_URL deve estar correto
```

**Erro: "Address already in use"**
```bash
# Mude a porta
uvicorn app.main:app --reload --port 8001
```

---

### ❌ Frontend não inicia

**Erro: "Cannot find module"**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Erro: "EACCES: permission denied"**
```bash
# Windows (execute PowerShell como Administrador)
# Mac/Linux:
sudo npm install
```

**Erro: "Port 5173 already in use"**
```bash
# Vite usa outra porta automaticamente (3000, 5174, etc)
```

---

### ❌ Login não funciona

**Erro: "Network Error"**
- Verifique se backend está rodando: http://localhost:8000/docs
- Verifique VITE_API_URL no frontend/.env

**Erro: "401 Unauthorized"**
- Verifique email e senha
- Registre usuário novamente via Swagger

**Erro: "CORS Error"**
```env
# backend/.env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

### ❌ WhatsApp não envia

WhatsApp precisa de configuração adicional:

1. Crie conta em [360Dialog](https://www.360dialog.com/)
2. Obtenha API Token e Phone Number ID
3. Atualize backend/.env:
```env
WHATSAPP_API_URL=https://waba.360dialog.io/v1/messages
WHATSAPP_API_TOKEN=seu-token-real
WHATSAPP_PHONE_NUMBER_ID=seu-id-real
```
4. Reinicie o backend

⚠️ **Sem configuração, pedidos funcionam mas WhatsApp não envia**

---

## 📞 Suporte

Problemas? Siga estes passos:

1. **Verifique os logs:**
   - Backend: Terminal onde rodou uvicorn
   - Frontend: Console do navegador (F12)

2. **Teste endpoints:**
   - http://localhost:8000/health
   - http://localhost:8000/docs

3. **Verifique arquivos .env:**
   - backend/.env existe e está configurado?
   - frontend/.env existe e está configurado?

4. **Consulte documentação:**
   - `INTEGRATION_GUIDE.md`
   - `TEST_CONNECTION.md`

---

## 🎉 Pronto para Produção?

- [ ] Mudar DEBUG=False no backend/.env
- [ ] Gerar SECRET_KEY forte
- [ ] Configurar HTTPS
- [ ] Configurar domínio próprio
- [ ] Configurar WhatsApp API real
- [ ] Fazer backup do banco
- [ ] Configurar monitoramento
- [ ] Adicionar rate limiting

Consulte `DEPLOY.md` para instruções de deploy.

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👨‍💻 Desenvolvido com ❤️

Sistema criado para facilitar o gerenciamento de entregas de gás e água.

**Versão:** 1.0.0  
**Última atualização:** Setembro 2025