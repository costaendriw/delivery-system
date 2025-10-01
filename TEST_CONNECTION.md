# 🧪 Guia de Testes - Verificação Completa do Sistema

Execute estes testes para garantir que tudo está funcionando corretamente.

---

## ✅ Checklist Pré-Testes

Antes de começar, verifique:

- [ ] PostgreSQL instalado e rodando
- [ ] Python 3.11+ instalado
- [ ] Node.js 18+ instalado
- [ ] Banco de dados `delivery_db` criado
- [ ] Backend: dependências instaladas (`pip install -r requirements.txt`)
- [ ] Frontend: dependências instaladas (`npm install`)
- [ ] Backend: arquivo `.env` configurado
- [ ] Frontend: arquivo `.env` configurado

---

## 🔧 Teste 1: Verificar Instalações

### **1.1 - Python:**
```bash
python --version
# Esperado: Python 3.11.x ou superior
```

### **1.2 - Node.js:**
```bash
node --version
# Esperado: v18.x.x ou superior
```

### **1.3 - PostgreSQL:**
```bash
psql --version
# Esperado: psql (PostgreSQL) 15.x ou superior
```

✅ **Passou?** Continue para Teste 2  
❌ **Falhou?** Instale a ferramenta faltante

---

## 🔧 Teste 2: Backend Inicializa?

### **2.1 - Ativar ambiente virtual:**

**Windows (PowerShell):**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
```

**Mac/Linux:**
```bash
cd backend
source venv/bin/activate
```

✅ **Você verá `(venv)` no início da linha**

### **2.2 - Iniciar backend:**
```bash
uvicorn app.main:app --reload
```

**Resultado esperado:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Application startup complete.
```

✅ **Passou?** Backend está rodando!  
❌ **Falhou?** Veja [Erros Comuns](#erros-comuns-backend)

### **2.3 - Testar endpoint de saúde:**
```bash
curl http://localhost:8000/health
```

**Resultado esperado:**
```json
{"status":"healthy"}
```

✅ **Passou?** Continue para Teste 3

---

## 🔧 Teste 3: Frontend Inicializa?

### **3.1 - Abrir NOVO terminal:**

⚠️ **IMPORTANTE:** Não feche o terminal do backend!

### **3.2 - Iniciar frontend:**
```bash
cd frontend
npm run dev
```

**Resultado esperado:**
```
VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

✅ **Passou?** Frontend está rodando!  
❌ **Falhou?** Veja [Erros Comuns](#erros-comuns-frontend)

### **3.3 - Abrir no navegador:**

Acesse: **http://localhost:5173**

**Resultado esperado:**  
Tela de login aparece

✅ **Passou?** Continue para Teste 4

---

## 🔧 Teste 4: API Swagger Funciona?

### **4.1 - Acessar Swagger:**

Abra: **http://localhost:8000/docs**

**Resultado esperado:**  
Interface Swagger UI carrega

✅ **Passed?** Continue para Teste 5

---

## 🔧 Teste 5: Criar Usuário

### **5.1 - Via Swagger:**

1. Em http://localhost:8000/docs
2. Procure `POST /api/v1/auth/register`
3. Clique em **"Try it out"**
4. Preencha:

```json
{
  "email": "teste@teste.com",
  "full_name": "Usuário Teste",
  "password": "senha123"
}
```

5. Clique em **"Execute"**

**Resultado esperado:**
```json
{
  "id": 1,
  "email": "teste@teste.com",
  "full_name": "Usuário Teste",
  "is_active": true,
  "is_admin": false,
  "created_at": "2025-09-30T..."
}
```

Status: **201 Created**

✅ **Passou?** Usuário criado!  
❌ **Falhou?** Verifique banco de dados

---

## 🔧 Teste 6: Login no Frontend

### **6.1 - Fazer login:**

1. Acesse: http://localhost:5173
2. Digite:
   - **Email:** `teste@teste.com`
   - **Senha:** `senha123`
3. Clique em **"Entrar"**

**Resultado esperado:**
- Redireciona para `/` (Dashboard)
- Navbar mostra "Usuário Teste"
- Sidebar visível com menu

✅ **Passou?** Autenticação funcionando!  
❌ **Falhou?** Veja logs do console (F12)

---

## 🔧 Teste 7: Criar Cliente

### **7.1 - Navegar para Clientes:**

1. No Dashboard, clique em **"Clientes"** (sidebar)

### **7.2 - Criar cliente:**

1. Clique em **"Novo Cliente"**
2. Preencha:
   - **Nome:** João da Silva
   - **Telefone:** 27999887766
   - **Endereço:** Rua das Flores, 123, Centro, Vila Velha - ES
   - **Padrão de consumo:** 30
3. Clique em **"Criar"**

**Resultado esperado:**
- Modal fecha
- Alerta: "Cliente criado com sucesso!"
- Cliente aparece na lista

✅ **Passou?** CRUD de clientes funcionando!  
❌ **Falhou?** Veja console do navegador

---

## 🔧 Teste 8: Criar Produto

### **8.1 - Navegar para Produtos:**

1. Clique em **"Produtos"** (sidebar)

### **8.2 - Criar produto:**

1. Clique em **"Novo Produto"**
2. Preencha:
   - **Nome:** Botijão P13
   - **Descrição:** Botijão de gás 13kg
   - **Tipo:** Gás
   - **Preço:** 110.00
   - **Estoque:** 50
   - **Status:** Ativo
3. Clique em **"Criar"**

**Resultado esperado:**
- Produto criado
- Aparece na lista

✅ **Passou?** CRUD de produtos funcionando!

---

## 🔧 Teste 9: Criar Pedido (WhatsApp)

### **9.1 - Navegar para Pedidos:**

1. Clique em **"Pedidos"** (sidebar)

### **9.2 - Criar pedido:**

1. Clique em **"Novo Pedido"**
2. Selecione o **cliente** criado
3. Clique em **"+ Adicionar Item"**
4. Selecione **produto:** Botijão P13
5. **Quantidade:** 2
6. **Observações:** "Entregar pela manhã"
7. Clique em **"Criar Pedido"**

**Resultado esperado:**
- Modal fecha
- Alerta: "Pedido criado com sucesso! WhatsApp enviado."
- Pedido aparece na lista com status "Novo"

✅ **Passou?** Criação de pedidos funcionando!  
📱 **WhatsApp:** Se configurado, mensagem foi enviada

**Verificar WhatsApp no backend:**
```bash
# No terminal do backend procure:
INFO:     Enviando WhatsApp para 27999887766...
```

---

## 🔧 Teste 10: Atualizar Status do Pedido

### **10.1 - Iniciar entrega:**

1. No pedido criado, clique em **"Iniciar Entrega"**

**Resultado esperado:**
- Status muda para **"Em Entrega"**
- Badge fica amarelo

### **10.2 - Concluir entrega:**

1. Clique em **"Concluir Entrega"**

**Resultado esperado:**
- Status muda para **"Concluído"**
- Badge fica verde
- Alerta de sucesso
- WhatsApp de confirmação enviado (se configurado)

✅ **Passou?** Fluxo completo de pedidos funcionando!

---

## 🔧 Teste 11: Dashboard

### **11.1 - Ver estatísticas:**

1. Clique em **"Dashboard"** (sidebar)

**Resultado esperado:**
- **Total de Pedidos:** 1
- **Novos Pedidos:** 0
- **Em Entrega:** 0
- **Concluídos:** 1
- Pedido aparece em "Pedidos Recentes"

✅ **Passou?** Dashboard funcionando!

---

## 🔧 Teste 12: Logout

### **12.1 - Fazer logout:**

1. Clique no botão **"Sair"** (navbar, canto superior direito)

**Resultado esperado:**
- Redireciona para `/login`
- Token removido do localStorage
- Não consegue acessar rotas protegidas

✅ **Passou?** Sistema completo funcionando! 🎉

---

## 📊 Resumo dos Testes

| # | Teste | Status | Notas |
|---|-------|--------|-------|
| 1 | Verificar instalações | ⬜ | Python, Node, PostgreSQL |
| 2 | Backend inicializa | ⬜ | Port 8000 |
| 3 | Frontend inicializa | ⬜ | Port 5173 |
| 4 | Swagger funciona | ⬜ | /docs |
| 5 | Criar usuário | ⬜ | Via Swagger |
| 6 | Login frontend | ⬜ | Autentica e redireciona |
| 7 | Criar cliente | ⬜ | CRUD funcionando |
| 8 | Criar produto | ⬜ | CRUD funcionando |
| 9 | Criar pedido | ⬜ | + WhatsApp |
| 10 | Atualizar status | ⬜ | + WhatsApp |
| 11 | Dashboard | ⬜ | Estatísticas |
| 12 | Logout | ⬜ | Remove token |

---

## 🐛 Erros Comuns

### **Erros Comuns - Backend**

#### **Erro: "ModuleNotFoundError: No module named 'fastapi'"**
```bash
cd backend
pip install -r requirements.txt
```

#### **Erro: "Database connection failed"**
```bash
# Verificar se PostgreSQL está rodando

# Windows:
Get-Service postgresql*

# Mac:
brew services list | grep postgresql

# Linux:
sudo systemctl status postgresql

# Criar banco se não existir:
createdb delivery_db
```

#### **Erro: "Address already in use (Port 8000)"**
```bash
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8000 | xargs kill -9

# Ou use outra porta:
uvicorn app.main:app --reload --port 8001
```

---

### **Erros Comuns - Frontend**

#### **Erro: "Cannot find module"**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### **Erro: "EACCES: permission denied"**
```bash
# Windows: Execute PowerShell como Administrador
# Mac/Linux:
sudo npm install
```

#### **Erro: "Network Error" ao fazer requisição**
- Backend não está rodando
- URL incorreta no `.env`
- CORS mal configurado

**Solução:**
1. Verifique se backend está em http://localhost:8000
2. Verifique `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```
3. Verifique `backend/.env`:
   ```env
   ALLOWED_ORIGINS=http://localhost:5173
   ```

---

### **Erro: "401 Unauthorized"**

#### **No login:**
- Email ou senha incorretos
- Usuário não existe

**Solução:** Registre usuário novamente via Swagger

#### **Em outras rotas:**
- Token expirou
- Token inválido

**Solução:**
1. Faça logout
2. Faça login novamente
3. Token será renovado

---

### **Erro: "CORS policy" no console**

```
Access to XMLHttpRequest at 'http://localhost:8000/api/v1/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solução:**

1. Edite `backend/.env`:
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

2. Reinicie o backend:
```bash
# Ctrl+C no terminal do backend
uvicorn app.main:app --reload
```

---

## 🔍 Debug Avançado

### **Ver requisições HTTP:**

1. Abra DevTools (F12)
2. Aba **Network**
3. Filtre por **XHR** ou **Fetch**
4. Clique em uma requisição
5. Veja:
   - **Headers:** Token sendo enviado?
   - **Payload:** Dados corretos?
   - **Response:** O que voltou?
   - **Status:** 200, 401, 500?

### **Ver logs do backend:**

```bash
# Terminal do backend mostra cada requisição:
INFO:     127.0.0.1:52341 - "GET /api/v1/customers/ HTTP/1.1" 200 OK
INFO:     127.0.0.1:52342 - "POST /api/v1/orders/ HTTP/1.1" 201 Created
```

### **Testar endpoint manualmente:**

```bash
# 1. Obter token
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=teste@teste.com&password=senha123"

# Resposta:
# {"access_token":"eyJhbGc...","token_type":"bearer"}

# 2. Usar token para acessar rota protegida
curl -X GET "http://localhost:8000/api/v1/customers/" \
  -H "Authorization: Bearer eyJhbGc..."
```

### **Limpar cache e tentar novamente:**

```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json .vite
npm install

# Backend
cd backend
rm -rf __pycache__ app/__pycache__
pip install --upgrade -r requirements.txt
```

---

## 📱 Testar Integração WhatsApp

### **Pré-requisitos:**

Para testar WhatsApp, você precisa:

1. Conta no [360Dialog](https://www.360dialog.com/) ou [Twilio](https://www.twilio.com/)
2. API Token
3. Phone Number ID

### **Configurar WhatsApp:**

Edite `backend/.env`:

```env
WHATSAPP_API_URL=https://waba.360dialog.io/v1/messages
WHATSAPP_API_TOKEN=seu-token-real-aqui
WHATSAPP_PHONE_NUMBER_ID=seu-phone-id-aqui
```

Reinicie o backend.

### **Teste de envio:**

1. Crie um pedido no frontend
2. Verifique logs do backend:

```bash
INFO:     Enviando WhatsApp para 27999887766...
INFO:     WhatsApp enviado com sucesso!
```

3. Cliente deve receber mensagem:

```
🎉 Pedido Confirmado!

Olá João da Silva!

Seu pedido #1 foi confirmado com sucesso.

Itens:
• 2x Botijão P13

Total: R$ 220.00

Em breve entraremos em contato para agendar a entrega.

Obrigado pela preferência! 🚚
```

✅ **Recebeu?** WhatsApp funcionando!  
❌ **Não recebeu?** Verifique token e phone ID

---

## 🎯 Teste de Carga (Opcional)

### **Testar múltiplos pedidos:**

```bash
# Via Swagger, crie vários pedidos rapidamente
# Ou use script Python:

import requests

for i in range(10):
    requests.post("http://localhost:8000/api/v1/orders/", 
        headers={"Authorization": "Bearer SEU_TOKEN"},
        json={
            "customer_id": 1,
            "items": [{"product_id": 1, "quantity": 1}]
        }
    )
```

**Resultado esperado:**
- Backend processa todos sem erro
- Dashboard mostra 10+ pedidos
- Sistema permanece responsivo

---

## ✅ Checklist Final

Se TODOS os testes passaram:

- [x] ✅ Backend funcionando
- [x] ✅ Frontend funcionando
- [x] ✅ Banco de dados conectado
- [x] ✅ Autenticação JWT funcionando
- [x] ✅ CRUD de clientes funcionando
- [x] ✅ CRUD de produtos funcionando
- [x] ✅ CRUD de pedidos funcionando
- [x] ✅ Fluxo completo de entrega funcionando
- [x] ✅ Dashboard com estatísticas
- [x] ✅ WhatsApp integrado (opcional)

## 🎉 **PARABÉNS!**

Seu sistema está **100% funcional**! 🚀

---

## 📞 Próximos Passos

Agora que tudo está funcionando:

1. **Adicione dados de teste:**
   - Crie 5-10 clientes
   - Crie 5-10 produtos
   - Crie 10-20 pedidos

2. **Teste cenários reais:**
   - Crie pedidos com múltiplos itens
   - Teste padrões de consumo diferentes
   - Acompanhe todo o fluxo de entrega

3. **Configure WhatsApp para produção:**
   - Use API Token real
   - Teste com números reais

4. **Customize o sistema:**
   - Ajuste cores no TailwindCSS
   - Adicione logo da empresa
   - Personalize mensagens do WhatsApp

5. **Faça backup do banco:**
   ```bash
   pg_dump delivery_db > backup.sql
   ```

6. **Prepare para produção:**
   - Consulte `DEPLOY.md`
   - Configure HTTPS
   - Configure domínio

---

## 📚 Documentação Adicional

- [README.md](README.md) - Documentação principal
- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - Guia de integração
- [Backend API Docs](http://localhost:8000/docs) - Swagger UI

---

## 🆘 Suporte

Se algum teste falhou:

1. Leia a mensagem de erro completa
2. Consulte seção "Erros Comuns" acima
3. Verifique logs do backend e frontend
4. Teste endpoints manualmente
5. Verifique configurações do `.env`

**Ainda com problema?**
- Revise o `README.md`
- Consulte o `INTEGRATION_GUIDE.md`
- Verifique se todas as dependências estão instaladas

---

**Última atualização:** Setembro 2025  
**Versão:** 1.0.0# 🧪 Testes de Conexão Backend ↔️ Frontend

Execute estes testes para verificar se tudo está funcionando.

---

## ✅ Pré-requisitos

- [ ] Backend rodando em http://localhost:8000
- [ ] Frontend rodando em http://localhost:3000
- [ ] PostgreSQL rodando
- [ ] Banco de dados criado

---

## 🔧 Teste 1: Backend Está Funcionando?

```bash
curl http://localhost:8000/health
```

**Resultado esperado:**
```json
{"status": "healthy"}
```

✅ **Passou?** Siga para Teste 2  
❌ **Falhou?** Inicie o backend

---

## 🔧 Teste 2: Frontend Carrega?

Abra: http://localhost:3000

**Resultado esperado:**  
Tela de login aparece

✅ **Passou?** Siga para Teste 3  
❌ **Falhou?** Execute `npm run dev` no frontend

---

## 🔧 Teste 3: Criar Usuário (Backend)

### Via cURL:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@teste.com",
    "full_name": "Usuario Teste",
    "password": "senha123"
  }'
```

### Ou via Swagger:

1. Acesse: http://localhost:8000/docs
2. POST `/api/v1/auth/register`
3. Try it out
4. Execute

**Resultado esperado:**
```json
{
  "id": 1,
  "email": "teste@teste.com",
  "full_name": "Usuario Teste",
  ...
}
```

✅ **Passou?** Siga para Teste 4  
❌ **Falhou?** Verifique banco de dados

---

## 🔧 Teste 4: Login no Frontend

1. Acesse: http://localhost:3000
2. Digite:
   - Email: `teste@teste.com`
   - Senha: `senha123`
3. Clique em "Entrar"

**Resultado esperado:**  
- Redirecionado para `/` (Dashboard)
- Navbar mostra nome do usuário
- Sidebar visível

✅ **Passou?** Siga para Teste 5  
❌ **Falhou?** Abra console (F12) e veja o erro

**Erros comuns:**

- `Network Error`: Backend não está rodando
- `401`: Credenciais incorretas
- `CORS`: Configure ALLOWED_ORIGINS no backend

---

## 🔧 Teste 5: Criar Cliente

1. No Dashboard, clique em "Clientes" (sidebar)
2. Clique em "Novo Cliente"
3. Preencha:
   - Nome: João Silva
   - Telefone: 27999999999
   - Endereço: Rua Teste, 123
   - Padrão: 30
4. Clique em "Criar"

**Resultado esperado:**
- Modal fecha
- Alerta "Cliente criado com sucesso!"
- Cliente aparece na lista

✅ **Passou?** Siga para Teste 6  
❌ **Falhou?** Veja console e logs do backend

---

## 🔧 Teste 6: Criar Produto

1. Clique em "Produtos" (sidebar)
2. Clique em "Novo Produto"
3. Preencha:
   - Nome: Botijão P13
   - Tipo: Gás
   - Preço: 110.00
   - Estoque: 50
4. Clique em "Criar"

**Resultado esperado:**
- Produto criado
- Aparece na lista

✅ **Passou?** Siga para Teste 7

---

## 🔧 Teste 7: Criar Pedido

1. Clique em "Pedidos" (sidebar)
2. Clique em "Novo Pedido"
3. Selecione cliente criado
4. Clique em "+ Adicionar Item"
5. Selecione produto e quantidade
6. Adicione observação (opcional)
7. Clique em "Criar Pedido"

**Resultado esperado:**
- Pedido criado
- Alerta "Pedido criado com sucesso! WhatsApp enviado."
- Pedido aparece na lista

✅ **Passou?** Siga para Teste 8

**Verificar WhatsApp:**
- Se configurado, mensagem foi enviada
- Veja logs do backend para confirmação

---

## 🔧 Teste 8: Atualizar Status do Pedido

1. No pedido criado, clique em "Iniciar Entrega"
2. Status muda para "Em Entrega"
3. Clique em "Concluir Entrega"

**Resultado esperado:**
- Status muda para "Concluído"
- WhatsApp de confirmação enviado (se configurado)

✅ **Passou?** Integração completa!

---

## 🔧 Teste 9: Verificar Dashboard

1. Volte ao Dashboard
2. Verifique estatísticas

**Resultado esperado:**
- Total de pedidos: 1
- Concluídos: 1
- Pedido aparece em "Pedidos Recentes"

✅ **Passou?** Tudo funcionando!

---

## 🔧 Teste 10: Logout

1. Clique no botão "Sair" (navbar)

**Resultado esperado:**
- Redirecionado para `/login`
- Token removido
- Não consegue acessar rotas protegidas

✅ **Passou?** Perfeito!

---

## 📊 Resumo dos Testes

| # | Teste | Status |
|---|-------|--------|
| 1 | Backend funcionando | ⬜ |
| 2 | Frontend carrega | ⬜ |
| 3 | Criar usuário | ⬜ |
| 4 | Login | ⬜ |
| 5 | Criar cliente | ⬜ |
| 6 | Criar produto | ⬜ |
| 7 | Criar pedido | ⬜ |
| 8 | Atualizar status | ⬜ |
| 9 | Dashboard | ⬜ |
| 10 | Logout | ⬜ |

---

## 🐛 Debug Rápido

### Ver requisições do frontend

1. Abra DevTools (F12)
2. Aba "Network"
3. Filtre por "XHR"
4. Veja todas as requisições para a API

### Ver logs do backend

No terminal onde rodou `uvicorn`:
```
INFO:     127.0.0.1:54321 - "POST /api/v1/orders/ HTTP/1.1" 201 Created
```

### Testar endpoint específico

```bash
# Com autenticação
curl -X GET "http://localhost:8000/api/v1/customers/" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## ✅ Todos os Testes Passaram?

**Parabéns! 🎉**

Sua integração está completa e funcionando perfeitamente!

Agora você pode:
- Gerenciar clientes
- Gerenciar produtos
- Criar e acompanhar pedidos
- Receber notificações automáticas no WhatsApp

---

## ❌ Algum Teste Falhou?

Consulte:
1. `INTEGRATION_GUIDE.md` - Guia detalhado
2. Console do navegador (F12)
3. Logs do backend (terminal)
4. Swagger UI (http://localhost:8000/docs)

### Problemas Comuns e Soluções

**"Cannot connect to backend"**
```bash
# Verificar se backend está rodando
curl http://localhost:8000/health

# Se não estiver, inicie:
cd backend
uvicorn app.main:app --reload
```

**"401 Unauthorized"**
```bash
# Limpe o localStorage e faça login novamente
# No console do navegador:
localStorage.clear()
# Recarregue a página
```

**"CORS Error"**
```bash
# Verifique ALLOWED_ORIGINS no backend/.env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

**"Database connection error"**
```bash
# Verifique se PostgreSQL está rodando
# Verifique DATABASE_URL no .env
# Teste conexão:
psql -U postgres -d delivery_db
```

---

## 📞 Próximos Passos

Se todos os testes passaram, você está pronto para:

1. **Produção**: Configure variáveis de ambiente para produção
2. **Deploy**: Siga `DEPLOY.md` (backend) para fazer deploy
3. **Customização**: Adicione suas próprias funcionalidades
4. **Teste Real**: Configure WhatsApp API e teste notificações

**Dica:** Sempre teste localmente antes de fazer deploy!