# Configuração de Ambiente de Testes

Este documento descreve como configurar o ambiente de testes do projeto Rota Cultural para novos desenvolvedores.

## Pré-requisitos

1. **PostgreSQL instalado e em execução**
   ```bash
   # Ubuntu/Debian:
   sudo apt-get install postgresql postgresql-contrib

   # Arch/Cachyos:
   sudo pacman -Syu postgresql
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

2. **UV (Package Manager) instalado**
   ```bash
   # Instalar UV
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

## Configuração do Banco de Testes

### 1. Clonar o Projeto
```bash
git clone <repository-url>
cd "ROTA CULTURAL/backend"
```

### 2. Instalar Dependências
```bash
uv sync
```

### 3. Configurar Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas configurações
nano .env
```

**Configure os seguintes valores em `.env`:**
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=cultural_route
DATABASE_USER=postgres
DATABASE_PASSWORD=your-postgres-password
```

### 4. Criar Banco de Dados Principal
```bash
# Acessar PostgreSQL
sudo -u postgres psql

# Criar banco principal
CREATE DATABASE cultural_route;

# Criar banco de testes (opcional - pytest faz isso automaticamente)
CREATE DATABASE test_cultural_route;

# Sair do PostgreSQL
\q
```

### 5. Configurar Senha do PostgreSQL (se necessário)
```bash
# Definir senha para usuário postgres
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'sua-senha-aqui';"
```

### 6. Aplicar Migrações
```bash
# Aplicar migrações ao banco principal
uv run python manage.py migrate

# Aplicar migrações ao banco de testes
DATABASE_NAME=test_cultural_route uv run python manage.py migrate
```

## Executar Testes

### Testes Automáticos (Recomendado)
```bash
# Executar todos os testes (pytest cria e gerencia o banco automaticamente)
uv run pytest

# Executar testes com saída detalhada
uv run pytest -v

# Executar apenas testes de segurança
uv run pytest -m security

# Executar apenas testes de performance
uv run pytest -m performance
```

### Testes Manuais (Debug)
```bash
# Limpar banco de testes completamente
PGPASSWORD=sua-senha psql -h localhost -U postgres -d test_cultural_route -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Recriar tabelas do banco de testes
DATABASE_NAME=test_cultural_route uv run python manage.py migrate
```

## Configuração do Test Database

O pytest-django automaticamente:
1. Usa o banco `test_cultural_route` para testes
2. Aplica migrações antes de executar os testes
3. Usa `--reuse-db` para performance (configurado em pytest.ini)
4. Isola os testes do banco de desenvolvimento

## Verificação da Configuração

### Verificar Instalação
```bash
# Verificar se pytest está funcionando
uv run pytest --collect-only

# Verificar se banco de testes está acessível
DATABASE_NAME=test_cultural_route uv run python manage.py dbshell --command="SELECT 1;"
```

### Verificar Tabelas do Test Database
```bash
PGPASSWORD=sua-senha psql -h localhost -U postgres -d test_cultural_route -c "\dt"
```

## Problemas Comuns

### 1. "connection refused" no PostgreSQL
```bash
# Verificar se PostgreSQL está em execução
sudo systemctl status postgresql

# Iniciar PostgreSQL se necessário
sudo systemctl start postgresql
```

### 2. "database does not exist"
```bash
# Criar banco de testes manualmente
PGPASSWORD=sua-senha createdb -h localhost -U postgres test_cultural_route

# Aplicar migrações
DATABASE_NAME=test_cultural_route uv run python manage.py migrate
```

### 3. "permission denied for database"
```bash
# Conceder permissões ao usuário postgres
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE test_cultural_route TO postgres;"
```

## Estrutura dos Testes

```
tests/
├── conftest.py              # Configuração global e fixtures
├── test_security.py         # Testes de segurança (20+ testes)
├── test_performance.py      # Testes de performance (11+ testes)
└── rota_cultural/apps/
    ├── locations/tests.py           # Testes do modelo Location (14 testes)
    ├── geocoding/tests_api.py       # Testes da API de Geocoding (18+ testes)
    └── routing/tests_api.py         # Testes da API de Routing (15+ testes)
```

## Informações Importantes

- **Banco Principal**: `cultural_route` (desenvolvimento)
- **Banco de Testes**: `test_cultural_route` (isolado, gerenciado pelo pytest)
- **Porta PostgreSQL**: 5432 (padrão)
- **Usuario PostgreSQL**: postgres (configurável)
- **Testes Totais**: 70+ testes automatizados

O ambiente de testes está configurado para uso imediato após os passos acima.