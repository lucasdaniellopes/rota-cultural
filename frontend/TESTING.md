# Testes Frontend - Vitest

## 🚀 Configuração

Os testes foram configurados com:
- **Vitest**: Test runner rápido e moderno
- **React Testing Library**: Testes focados no comportamento do usuário
- **MSW (Mock Service Worker)**: Mock de requisições HTTP

## 📦 Instalação de Dependências

As dependências já foram instaladas durante a configuração. Se precisar reinstalar:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event msw happy-dom
```

## 🧪 Rodando os Testes

### Teste simples (modo watch)
```bash
npm test
```

### Teste único
```bash
npm test -- api.test.ts
npm test -- routing.test.tsx
npm test -- geocoding.test.ts
```

### Teste com interface visual
```bash
npm run test:ui
```

### Teste com cobertura
```bash
npm run test:coverage
```

## 📋 Testes Implementados

**Status Atual:** ✅ **28 testes passando**

### 1. **API Service Tests** (`api.test.ts`) - 11 testes ✅

#### Localizações (4 testes)
- ✅ `getLocations()` retorna array de localizações
- ✅ Dados das localizações estão corretos
- ✅ Trata respostas paginadas do DRF
- ✅ Retorna array vazio em erro

#### Routing Service (2 testes)
- ✅ Envia requisição POST com waypoint IDs
- ✅ Retorna dados de rota com geometria válida (distance, geometry [lon, lat])

#### Geocoding Service (5 testes)
- ✅ Forward geocoding: busca de endereço com parâmetro `address`
- ✅ Retorna coordenadas corretas para endereço pesquisado
- ✅ Reverse geocoding: coordenadas para endereço
- ✅ Retorna endereço para clique no mapa
- ✅ Retorna lista vazia para endereço inválido

### 2. **Routing Tests** (`routing.test.tsx`) - 5 testes ✅

#### Integração com MapPage
- ✅ Carrega e exibe localizações no dropdown
- ✅ Permite selecionar dois pontos para criar rota
- ✅ Desabilita botão calcular rota quando menos de 2 pontos selecionados
- ✅ Exibir botão adicionar parada
- ✅ Exibir legenda com cores dos marcadores

**Fluxo testado:**
1. Página carrega com localizações da API
2. Clica em dropdown e vê: Praça Getúlio Vargas, Igreja Matriz, Museu do Cariri
3. Seleciona "Localização" → Praça Getúlio Vargas
4. Seleciona "Destino" → Igreja Matriz
5. Botão "Calcular Rota" fica habilitado

### 3. **Geocoding Tests** (`geocoding.test.ts`) - 12 testes ✅

#### Forward Geocoding (5 testes)
- ✅ Faz requisição GET com parâmetro `address`
- ✅ Retorna resultados com `name`, `latitude`, `longitude`
- ✅ Retorna coordenadas dentro de intervalos válidos (-90 a 90 lat, -180 a 180 lon)
- ✅ Retorna lista vazia para endereço vazio
- ✅ Suporta pesquisa parcial (ex: "Patos")

**Fluxo testado:**
1. Usuário digita "Praça Getúlio Vargas"
2. API retorna resultado com coordenadas válidas
3. Sistema verifica latitude (-7.026368) e longitude (-37.277010)

#### Reverse Geocoding (5 testes)
- ✅ Faz requisição GET com parâmetros `latitude` e `longitude`
- ✅ Retorna `name` e `address` do local
- ✅ Suporta múltiplas coordenadas diferentes
- ✅ Valida intervalos de coordenadas (Polo Sul até Polo Norte)
- ✅ Retorna dados válidos para todas as coordenadas

**Fluxo testado:**
1. Usuário clica no mapa em (-7.025000, -37.278000)
2. API retorna nome: "Museu do Cariri"
3. Sistema exibe o endereço no UI

#### Tratamento de Erros (2 testes)
- ✅ Lida com requisições inválidas (ex: address = null)
- ✅ Retorna erro 404 para endpoint inexistente

## 📊 Mock Data

Os testes usam dados mockados do MSW:

### Localizações
```typescript
[
  {
    id: 1,
    name: 'Praça Getúlio Vargas',
    latitude: -7.026368,
    longitude: -37.277010
  },
  {
    id: 2,
    name: 'Igreja Matriz',
    latitude: -7.027000,
    longitude: -37.276000
  },
  {
    id: 3,
    name: 'Museu do Cariri',
    latitude: -7.025000,
    longitude: -37.278000
  }
]
```

### Rota
```typescript
{
  distance: 2500,        // em metros
  duration: 300,         // em segundos
  geometry: [
    [-37.277010, -7.026368],
    [-37.276500, -7.026700],
    [-37.276000, -7.027000]
  ]
}
```

## 🔧 Configuração MSW

Os mocks estão configurados em `src/tests/setup.ts`:

- **GET `/locations/`** → Retorna lista paginada de localizações
- **POST `/routing/calculate/`** → Calcula rota entre waypoints
- **GET `/geocoding/forward/`** → Busca endereço
- **GET `/geocoding/reverse/`** → Busca endereço por coordenadas
