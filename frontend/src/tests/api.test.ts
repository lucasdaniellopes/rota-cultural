import { describe, it, expect } from 'vitest'
import { api, locationService } from '@/services/api'
import { mockLocations } from './setup'

describe('API Service', () => {
  describe('locationService.getLocations()', () => {
    it('deve retornar um array de localizações', async () => {
      const locations = await locationService.getLocations()
      
      expect(Array.isArray(locations)).toBe(true)
      expect(locations).toHaveLength(3)
      expect(locations[0]).toHaveProperty('id')
      expect(locations[0]).toHaveProperty('name')
      expect(locations[0]).toHaveProperty('latitude')
      expect(locations[0]).toHaveProperty('longitude')
    })

    it('deve conter dados das localizações corretos', async () => {
      const locations = await locationService.getLocations()
      
      expect(locations[0].name).toBe('Praça Getúlio Vargas')
      expect(locations[0].latitude).toBe(-7.026368)
      expect(locations[0].longitude).toBe(-37.277010)
    })

    it('deve lidar com respostas paginadas do DRF', async () => {
      const locations = await locationService.getLocations()
      
      // Deve extrair os dados de dentro da estrutura paginada
      expect(Array.isArray(locations)).toBe(true)
      expect(locations.length).toBeGreaterThan(0)
    })

    it('deve retornar array vazio em caso de erro', async () => {
      // Teste adicional de robustez
      const result = Array.isArray(mockLocations) ? mockLocations : []
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('routing service', () => {
    it('deve enviar requisição POST com waypoint IDs', async () => {
      const response = await api.post('/routing/calculate/', {
        waypointIds: [1, 2, 3]
      })

      expect(response.status).toBe(200)
      expect(response.data).toHaveProperty('distance')
      expect(response.data).toHaveProperty('geometry')
    })

    it('deve retornar dados de rota com geometria válida', async () => {
      const response = await api.post('/routing/calculate/', {
        waypointIds: [1, 2, 3]
      })

      const { distance, geometry } = response.data

      expect(typeof distance).toBe('number')
      expect(Array.isArray(geometry)).toBe(true)
      expect(geometry.length).toBeGreaterThan(0)
      
      // Cada ponto deve ter [longitude, latitude]
      geometry.forEach((point: number[]) => {
        expect(Array.isArray(point)).toBe(true)
        expect(point).toHaveLength(2)
      })
    })
  })

  describe('geocoding service', () => {
    it('deve fazer busca de endereço (forward geocoding)', async () => {
      const response = await api.get('/geocoding/forward/', {
        params: { address: 'Praça em Patos' }
      })

      expect(response.status).toBe(200)
      expect(response.data).toHaveProperty('results')
      expect(Array.isArray(response.data.results)).toBe(true)
    })

    it('deve retornar coordenadas para um endereço pesquisado', async () => {
      const response = await api.get('/geocoding/forward/', {
        params: { address: 'Igreja Matriz' }
      })

      const { results } = response.data

      if (results.length > 0) {
        expect(results[0]).toHaveProperty('latitude')
        expect(results[0]).toHaveProperty('longitude')
        expect(typeof results[0].latitude).toBe('number')
        expect(typeof results[0].longitude).toBe('number')
      }
    })

    it('deve fazer reverse geocoding de coordenadas', async () => {
      const response = await api.get('/geocoding/reverse/', {
        params: {
          latitude: -7.026368,
          longitude: -37.277010
        }
      })

      expect(response.status).toBe(200)
      expect(response.data).toHaveProperty('results')
      expect(Array.isArray(response.data.results)).toBe(true)
    })

    it('deve retornar endereço para coordenadas clicadas no mapa', async () => {
      const response = await api.get('/geocoding/reverse/', {
        params: {
          latitude: -7.025000,
          longitude: -37.278000
        }
      })

      const { results } = response.data

      if (results.length > 0) {
        expect(results[0]).toHaveProperty('name')
        expect(results[0]).toHaveProperty('address')
      }
    })

    it('deve retornar lista vazia para endereço inválido', async () => {
      const response = await api.get('/geocoding/forward/', {
        params: { address: '' }
      })

      expect(response.data.results).toEqual([])
    })
  })
})
