# Rota Cultural

Plataforma digital que conecta turistas e moradores locais à cultura e aos eventos da cidade de Patos - PB, oferecendo uma experiência completa de descoberta e planejamento de roteiros culturais.

## 📋 Índice

- [Stack Tecnológica](#stack-tecnológica)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Testes E2E](#testes-e2e)
- [Documentação da API](#documentação-da-api)
- [Variáveis de Ambiente](#variáveis-de-ambiente)

## 🚀 Stack Tecnológica

### Backend
- **Django 5.2+** - Framework web Python
- **Django REST Framework** - API REST
- **PostgreSQL** - Banco de dados relacional
- **GDAL/PostGIS** - Recursos geoespaciais
- **drf-spectacular** - Documentação OpenAPI/Swagger
- **Scalar** - Interface de documentação interativa
- **UV** - Gerenciador de pacotes Python moderno

### Frontend
- **React 18** - Biblioteca UI JavaScript
- **TypeScript** - Superset tipado de JavaScript
- **Vite** - Build tool e dev server
- **Styled Components** - CSS-in-JS
- **React Router** - Roteamento SPA
- **Leaflet** - Mapas interativos
- **pnpm** - Gerenciador de pacotes rápido

### Testes
- **Cypress 15.7.0** - Testes E2E
- **Testing Library** - Utilitários de teste
- **Pytest** - Testes unitários Python
- **Behave** - Testes BDD

## 📁 Estrutura do Projeto

```
ROTA CULTURAL/
├── backend/                    # Django API backend
│   ├── rota_cultural/
│   │   ├── core/              # Configurações Django
│   │   └── apps/              # Apps do Django
│   │       ├── users/         # Autenticação e usuários
│   │       ├── locations/     # Pontos turísticos
│   │       ├── events/        # Eventos culturais
│   │       ├── routing/       # Rotas e navegação
│   │       ├── reviews/       # Avaliações
│   │       ├── favorites/     # Favoritos
│   │       ├── notifications/ # Notificações
│   │       └── itineraries/   # Itinerários
│   ├── fixtures/              # Dados de teste
│   ├── tests/                 # Testes unitários
│   └── manage.py
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── pages/             # Páginas da aplicação
│   │   ├── services/          # Serviços de API
│   │   ├── contexts/          # Context API
│   │   └── App.tsx
│   ├── cypress/               # Testes E2E
│   │   ├── e2e/
│   │   │   ├── auth/          # Testes de autenticação
│   │   │   ├── authenticated/ # Testes autenticados
│   │   │   ├── public/        # Testes públicos
│   │   │   ├── integration/   # Testes de integração
│   │   │   └── examples/      # Exemplos de testes
│   │   ├── fixtures/          # Dados de teste
│   │   └── support/           # Comandos e helpers
│   └── package.json
│
├── tests/                      # Testes BDD (Behave)
│   ├── bdd/
│   ├── integration/
│   └── unit/
│
└── README.md
```

## ✨ Funcionalidades

### Públicas
- 🏠 **Home** - Página inicial com destaques
- 🗺️ **Mapa Interativo** - Visualização de pontos turísticos e eventos
- 📍 **Pontos Turísticos** - Listagem e detalhes de locais
- 🎉 **Eventos** - Calendário de eventos culturais
- 🔍 **Busca e Filtros** - Pesquisa por categoria, localização e data
- 🛣️ **Planejamento de Rotas** - Criação de rotas entre múltiplos pontos

### Autenticadas
- 👤 **Perfil de Usuário** - Gerenciamento de dados pessoais
- ⭐ **Favoritos** - Lista de locais e eventos favoritos
- ✍️ **Avaliações** - Sistema de reviews e comentários
- ➕ **Criar Conteúdo** - Adicionar novos pontos turísticos e eventos
- 🔐 **Segurança** - Alteração de senha e configurações

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- PostGIS (extensão PostgreSQL)
- pnpm
- UV (gerenciador Python)

### Backend (Django)

1. **Instale o UV**:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

2. **Clone o repositório**:
```bash
git clone <repositorio>
cd "ROTA CULTURAL"
```

3. **Configure o backend**:
```bash
cd backend
uv sync
```

4. **Configure as variáveis de ambiente**:
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

5. **Execute as migrações**:
```bash
uv run python manage.py migrate
```

6. **Carregue dados iniciais** (opcional):
```bash
uv run python manage.py loaddata fixtures/categories.json
```

7. **Crie um superusuário**:
```bash
uv run python manage.py createsuperuser
```

8. **Inicie o servidor**:
```bash
uv run python manage.py runserver
```

### Frontend (React)

1. **Instale o pnpm**:
```bash
npm install -g pnpm
```

2. **Configure o frontend**:
```bash
cd frontend
pnpm install
```

3. **Configure as variáveis de ambiente**:
```bash
cp .env.example .env
# Edite conforme necessário
```

4. **Inicie o servidor de desenvolvimento**:
```bash
pnpm dev
```

### Acessando a Aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://127.0.0.1:8000
- **API Docs (Scalar)**: http://127.0.0.1:8000/api/docs/
- **Admin Django**: http://127.0.0.1:8000/admin/

## 🧪 Testes E2E

O projeto utiliza **Cypress** para testes end-to-end completos.

### Estrutura dos Testes

```
cypress/e2e/
├── auth/                      # Autenticação
│   ├── login.cy.ts           # Login de usuário
│   └── signup.cy.ts          # Cadastro de usuário
│
├── authenticated/             # Funcionalidades autenticadas
│   ├── create-event.cy.ts    # Criação de eventos
│   ├── create-place.cy.ts    # Criação de pontos turísticos
│   ├── favorites.cy.ts       # Gerenciamento de favoritos
│   ├── profile.cy.ts         # Edição de perfil
│   └── reviews.cy.ts         # Sistema de avaliações
│
├── public/                    # Funcionalidades públicas
│   ├── home.cy.ts            # Página inicial
│   ├── map.cy.ts             # Mapa e rotas
│   ├── places-listing.cy.ts  # Listagem de pontos
│   ├── events-listing.cy.ts  # Listagem de eventos
│   └── item-detail.cy.ts     # Detalhes de itens
│
├── integration/               # Testes de integração
│   └── full-user-journey.cy.ts # Jornada completa do usuário
│
└── examples/                  # Exemplos e helpers
    └── using-helpers.cy.ts
```

### Comandos Customizados

O Cypress foi estendido com comandos customizados:

```typescript
// Login
cy.login(email, password)

// Logout
cy.logout()

// Criar ponto turístico
cy.createPlace(placeData)

// Criar evento
cy.createEvent(eventData)

// Adicionar aos favoritos
cy.addToFavorites(itemId, itemType)
```

### Executando os Testes

**Modo Interativo** (recomendado para desenvolvimento):
```bash
cd frontend
pnpm cypress:open
```

**Modo Headless** (CI/CD):
```bash
pnpm cypress:run
```

**Executar testes específicos**:
```bash
pnpm cypress:run --spec "cypress/e2e/auth/login.cy.ts"
```

**Executar com servidor**:
```bash
pnpm test:e2e
```

### Configuração dos Testes

Configure as credenciais de teste em `frontend/cypress.env.json`:

```json
{
  "TEST_USER_EMAIL": "teste@rotacultural.com",
  "TEST_USER_PASSWORD": "SenhaForte@123",
  "API_URL": "http://localhost:8000"
}
```

### Fixtures

Dados de teste estão disponíveis em `cypress/fixtures/`:
- `users.json` - Usuários de teste
- `places.json` - Pontos turísticos
- `events.json` - Eventos
- `reviews.json` - Avaliações
- `coordinates.json` - Coordenadas geográficas

## 📚 Documentação da API

A API REST está documentada usando **OpenAPI 3.0** e pode ser acessada através do **Scalar**:

- **Documentação Interativa**: http://127.0.0.1:8000/api/docs/
- **Schema OpenAPI**: http://127.0.0.1:8000/api/schema/

### Principais Endpoints

#### Autenticação
- `POST /api/v1/auth/token/` - Login (obter token)
- `POST /api/v1/auth/token/refresh/` - Renovar token
- `POST /api/v1/auth/register/` - Cadastro de usuário

#### Pontos Turísticos
- `GET /api/v1/tourist-spots/` - Listar pontos
- `POST /api/v1/tourist-spots/` - Criar ponto
- `GET /api/v1/tourist-spots/{id}/` - Detalhes
- `PUT /api/v1/tourist-spots/{id}/` - Atualizar
- `DELETE /api/v1/tourist-spots/{id}/` - Deletar

#### Eventos
- `GET /api/v1/events/` - Listar eventos
- `POST /api/v1/events/` - Criar evento
- `GET /api/v1/events/{id}/` - Detalhes
- `GET /api/v1/events/?filter=upcoming` - Eventos futuros

#### Rotas
- `POST /api/v1/routing/calculate/` - Calcular rota
- `GET /api/v1/locations/destinations/` - Destinos disponíveis

#### Favoritos
- `GET /api/v1/favorites/` - Listar favoritos
- `POST /api/v1/favorites/` - Adicionar favorito
- `DELETE /api/v1/favorites/{id}/` - Remover favorito

#### Avaliações
- `GET /api/v1/reviews/` - Listar avaliações
- `POST /api/v1/reviews/` - Criar avaliação
- `PUT /api/v1/reviews/{id}/` - Atualizar
- `DELETE /api/v1/reviews/{id}/` - Deletar

## 🔐 Variáveis de Ambiente

### Backend (.env)

```env
# Django
SECRET_KEY=sua-chave-secreta-aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_NAME=rota_cultural
DATABASE_USER=postgres
DATABASE_PASSWORD=sua-senha
DATABASE_HOST=localhost
DATABASE_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173

# JWT
JWT_ACCESS_TOKEN_LIFETIME=60  # minutos
JWT_REFRESH_TOKEN_LIFETIME=1440  # minutos (24h)

# Mapa
MAP_CENTER_LAT=-7.0227
MAP_CENTER_LNG=-37.2744
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000
VITE_MAP_CENTER_LAT=-7.0227
VITE_MAP_CENTER_LNG=-37.2744
```
