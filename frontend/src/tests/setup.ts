import '@testing-library/jest-dom'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { afterAll, afterEach, beforeAll } from 'vitest'

const API_BASE_URL = 'http://localhost:8000/api/v1'

export const mockLocations = [
  {
    id: 1,
    name: 'Praça Getúlio Vargas',
    description: 'Principal praça de Patos',
    latitude: -7.026368,
    longitude: -37.277010,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Igreja Matriz',
    description: 'Igreja histórica do centro',
    latitude: -7.027000,
    longitude: -37.276000,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Museu do Cariri',
    description: 'Museu de arte e cultura',
    latitude: -7.025000,
    longitude: -37.278000,
    created_at: '2025-01-01T00:00:00Z'
  }
]

export const mockRoute = {
  id: '1',
  distance: 2500,
  duration: 300,
  geometry: [
    [-37.277010, -7.026368],
    [-37.276500, -7.026700],
    [-37.276000, -7.027000]
  ]
}

export const server = setupServer(
  // Mock de listagem de localizações
  http.get(`${API_BASE_URL}/locations/`, () => {
    return HttpResponse.json({
      count: 3,
      next: null,
      previous: null,
      results: mockLocations
    })
  }),

  // Mock de cálculo de rota
  http.post(`${API_BASE_URL}/routing/calculate/`, () => {
    return HttpResponse.json(mockRoute)
  }),

  // Mock de geocoding (pesquisa de endereço)
  http.get(`${API_BASE_URL}/geocoding/forward/`, ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('address')
    
    if (!query) {
      return HttpResponse.json({ results: [] })
    }

    return HttpResponse.json({
      results: [
        {
          id: 1,
          name: `Resultado para "${query}"`,
          latitude: -7.026368,
          longitude: -37.277010,
          address: `Endereço em Patos relacionado a ${query}`
        }
      ]
    })
  }),

  // Mock de reverse geocoding (coordenadas para endereço)
  http.get(`${API_BASE_URL}/geocoding/reverse/`, ({ request }) => {
    const url = new URL(request.url)
    const lat = url.searchParams.get('latitude')
    const lng = url.searchParams.get('longitude')

    return HttpResponse.json({
      results: [
        {
          id: 1,
          name: 'Local no mapa',
          latitude: lat,
          longitude: lng,
          address: `Localização em Patos próxima a ${lat}, ${lng}`
        }
      ]
    })
  })
)

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
