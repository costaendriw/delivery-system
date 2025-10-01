# 🚀 Frontend - Sistema de Gerenciamento de Entregas

Frontend completo em **React + TypeScript + TailwindCSS** para gerenciamento de entregas de gás e água.

## 🛠️ Tecnologias

- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool moderno e rápido
- **TailwindCSS** - Framework CSS utility-first
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **React Hook Form** - Gerenciamento de formulários
- **Lucide React** - Ícones modernos
- **date-fns** - Manipulação de datas

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── assets/          # Imagens e ícones
│   ├── components/      # Componentes reutilizáveis
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Modal.tsx
│   │   ├── OrderCard.tsx
│   │   ├── StatCard.tsx
│   │   └── Loading.tsx
│   ├── context/         # Context API
│   │   └── AuthContext.tsx
│   ├── hooks/           # Hooks personalizados
│   │   └── useAuth.ts
│   ├── pages/           # Páginas
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Orders.tsx
│   │   ├── Customers.tsx
│   │   └── Products.tsx
│   ├── services/        # Comunicação com API
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── customers.ts
│   │   ├── orders.ts
│   │   └── products.ts
│   ├── types/           # Definições TypeScript
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd frontend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz:

```bash
cp .env.example .env
```

Edite o `.env`:

```
VITE_API_URL=http://localhost:8000/api/v1
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:3000`

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

## 🎨 Funcionalidades

### ✅ Autenticação
- Login com JWT
- Proteção de rotas privadas
- Logout

### 📊 Dashboard
- Visão geral dos pedidos
- Estatísticas (total, novos, em entrega, concluídos)
- Pedidos recentes

### 🛒 Gestão de Pedidos
- Listar todos os pedidos
- Criar novo pedido
- Filtrar por status
- Atualizar status (novo → em entrega → concluído)
- Visualizar detalhes e itens

### 👥 Gestão de Clientes
- CRUD completo
- Nome, telefone, endereço
- Padrão de consumo personalizado

### 📦 Gestão de Produtos
- CRUD completo
- Tipos: Gás e Água
- Controle de estoque
- Preços e descrições

## 🔐 Autenticação

O sistema usa JWT (JSON Web Token) para autenticação:

1. Usuário faz login na tela de login
2. Backend retorna token JWT
3. Token é armazenado no localStorage
4. Token é enviado automaticamente em todas as requisições
5. Se token expirar, usuário é redirecionado para login

## 🎨 Componentes Principais

### Layout
- **Navbar**: Barra superior com logo e botão de logout
- **Sidebar**: Menu lateral com navegação
- **Layout**: Container principal que combina Navbar + Sidebar

### Cards
- **OrderCard**: Exibe informações de um pedido
- **StatCard**: Card de estatística para dashboard

### Modals
- **Modal**: Component modal reutilizável para formulários

## 📡 Integração com Backend

O frontend consome a API REST do backend FastAPI:

```typescript
// Exemplo de requisição
import { orderService } from './services/orders'

const orders = await orderService.getAll()
const newOrder = await orderService.create(orderData)
```

### Endpoints consumidos:

- `POST /auth/login` - Login
- `POST /auth/register` - Registro
- `GET /customers/` - Listar clientes
- `POST /customers/` - Criar cliente
- `GET /products/` - Listar produtos
- `POST /orders/` - Criar pedido (envia WhatsApp)
- `POST /orders/{id}/complete` - Concluir pedido (envia WhatsApp)

## 🎯 Próximos Passos

1. **Instale as dependências**:
```bash
npm install
```

2. **Configure o backend**:
   - Certifique-se que o backend está rodando em `http://localhost:8000`

3. **Inicie o frontend**:
```bash
npm run dev
```

4. **Acesse**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

5. **Credenciais de teste**:
   - Primeiro registre um usuário na tela de login
   - Ou use credenciais criadas no backend

## 🐛 Troubleshooting

### Erro de CORS
Se encontrar erro de CORS, verifique:
- Backend está rodando?
- `ALLOWED_ORIGINS` no backend inclui `http://localhost:3000`

### Erro 401 Unauthorized
- Token pode ter expirado
- Faça logout e login novamente
- Verifique se o backend está configurado corretamente

### Erro ao criar pedido
- Verifique se há clientes cadastrados
- Verifique se há produtos cadastrados e ativos
- Verifique console do navegador para mais detalhes

## 🎨 Customização

### Cores
Edite `tailwind.config.js` para mudar o tema:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Suas cores aqui
      },
    },
  },
}
```

### Logo
Substitua o emoji 🚚 em:
- `src/components/Navbar.tsx`
- `src/pages/Login.tsx`

## 📱 Responsividade

O sistema é totalmente responsivo:
- Desktop: Layout completo com sidebar
- Tablet: Layout adaptado
- Mobile: Menu hamburguer (futuro)

## 🧪 Testes (Opcional)

```bash
# Instalar dependências de teste
npm install -D @testing-library/react @testing-library/jest-dom vitest

# Executar testes
npm run test
```

## 📦 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build
npm run build

# Faça upload da pasta dist/ no Netlify
```

### Variáveis de Ambiente em Produção

Lembre-se de configurar:
```
VITE_API_URL=https://sua-api-producao.com/api/v1
```

## 🔒 Segurança

- Tokens JWT armazenados no localStorage
- Rotas protegidas com PrivateRoute
- Interceptor Axios para token expirado
- Validação de formulários

## 📚 Recursos Úteis

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é open source.

## 👨‍💻 Desenvolvido com ❤️

Sistema criado para facilitar o gerenciamento de entregas de gás e água.