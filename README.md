

# Rota Cultural

Plataforma digital que conecta turistas e moradores locais à cultura e aos eventos da cidade de Patos - PB, oferecendo uma experiência completa de descoberta e planejamento de roteiros culturais.

## Stack Tecnológica

### Backend
- **Django 5.2+** - Framework web Python
- **Django REST Framework** - API REST
- **PostgreSQL** - Banco de dados
- **GDAL/PostGIS** - Recursos geoespaciais
- **drf-spectacular** - Documentação OpenAPI
- **Scalar** - Interface de documentação interativa
- **UV** - Gerenciador de pacotes Python

### Frontend
- **React 18** - Biblioteca UI JavaScript
- **TypeScript** - Superset de JavaScript
- **Vite** - Ferramenta de build e servidor de desenvolvimento
- **pnpm** - Gerenciador de pacotes

## Estrutura do Projeto

```
ROTA CULTURAL/
├── backend/                 # Django API backend
├── frontend/                # React frontend (Vite + TypeScript)
├── CLAUDE.md               # Guia de desenvolvimento
├── README.md               # Este arquivo
└── .gitignore              # Arquivos ignorados pelo git
```

## Estrutura do Backend

```
backend/
├── manage.py
├── rota_cultural/
│   ├── core/           # Configuracoes do Django
│   └── apps/           # Apps do Django
│       ├── users/      # Gerenciamento de usuarios
│       ├── locations/  # Pontos turisticos
│       ├── events/     # Eventos culturais
│       ├── routing/    # Rotas e roteiros
│       ├── reviews/    # Avaliacoes
│       ├── favorites/  # Favoritos
│       ├── notifications/ # Notificacoes
│       └── itineraries/  # Itinerarios
```

## Apps do Sistema

- **users**: Gerenciamento de usuarios e autenticacao
- **locations**: Cadastro e gerenciamento de pontos turisticos com geolocalizacao
- **events**: Eventos culturais com datas e locais
- **routing**: Criacao de rotas turisticas com multiplos pontos
- **reviews**: Sistema de avaliacoes para locais e eventos
- **favorites**: Lista de favoritos dos usuarios
- **notifications**: Sistema de notificacoes para usuarios
- **itineraries**: Planejamento de itinerarios personalizados

## Configuração do Ambiente

### Backend (Django)

1. Instale o UV (se ainda não tiver):
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

2. Clone o repositório:
```bash
git clone <repositorio>
cd "ROTA CULTURAL"
```

3. Instale as dependências do backend:
```bash
cd backend
uv sync
```

4. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

5. Execute as migrações:
```bash
uv run python manage.py migrate
```

6. Crie um superusuário:
```bash
uv run python manage.py createsuperuser
```

7. Inicie o servidor de desenvolvimento:
```bash
uv run python manage.py runserver
```

### Frontend (React)

1. Instale o pnpm (se ainda não tiver):
```bash
npm install -g pnpm
```

2. Instale as dependências do frontend:
```bash
cd frontend
pnpm install
```

3. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

### Acessando a Aplicação

- **Backend API**: http://127.0.0.1:8000
- **API Documentation**: http://127.0.0.1:8000/api/docs/
- **Frontend**: http://localhost:5173

## Variaveis de Ambiente

As seguintes variaveis devem ser configuradas no arquivo `.env`:
- `SECRET_KEY`: Chave secreta do Django
- `DEBUG`: Modo de debug (True/False)
- `DATABASE_NAME`: Nome do banco de dados
- `DATABASE_USER`: Usuario do banco
- `DATABASE_PASSWORD`: Senha do banco
- `DATABASE_HOST`: Host do banco
- `DATABASE_PORT`: Porta do banco

## API

O projeto utiliza Django REST Framework para criar uma API RESTful com endpoints para todos os recursos mencionados acima.