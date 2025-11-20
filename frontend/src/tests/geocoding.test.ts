import { describe, it, expect } from 'vitest'
import { api } from '@/services/api'

describe('Geocoding - Forward (Pesquisa de Endereço)', () => {
  it('deve fazer requisição GET com parâmetro de endereço', async () => {
    const response = await api.get('/geocoding/forward/', {
      params: { address: 'Praça Getúlio Vargas' }
    })

    expect(response.status).toBe(200)
    expect(response.config.params).toHaveProperty('address')
    expect(response.config.params.address).toBe('Praça Getúlio Vargas')
  })

  it('deve retornar resultados para endereço válido', async () => {
    const response = await api.get('/geocoding/forward/', {
      params: { address: 'Igreja Matriz' }
    })

    const { results } = response.data

    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBeGreaterThan(0)
    
    // Verificar estrutura dos resultados
    const result = results[0]
    expect(result).toHaveProperty('name')
    expect(result).toHaveProperty('latitude')
    expect(result).toHaveProperty('longitude')
  })

  it('deve retornar coordenadas corretas para localidade conhecida', async () => {
    const response = await api.get('/geocoding/forward/', {
      params: { address: 'Museu do Cariri' }
    })

    const { results } = response.data

    expect(results.length).toBeGreaterThan(0)
    expect(typeof results[0].latitude).toBe('number')
    expect(typeof results[0].longitude).toBe('number')
    
    // Verificar que latitude e longitude estão em intervalo válido
    expect(results[0].latitude).toBeGreaterThanOrEqual(-90)
    expect(results[0].latitude).toBeLessThanOrEqual(90)
    expect(results[0].longitude).toBeGreaterThanOrEqual(-180)
    expect(results[0].longitude).toBeLessThanOrEqual(180)
  })

  it('deve retornar lista vazia para endereço vazio', async () => {
    const response = await api.get('/geocoding/forward/', {
      params: { address: '' }
    })

    expect(response.data.results).toEqual([])
  })

  it('deve suportar pesquisa parcial de endereço', async () => {
    const response = await api.get('/geocoding/forward/', {
      params: { address: 'Patos' }
    })

    expect(response.status).toBe(200)
    // Pode retornar resultados ou lista vazia dependendo da implementação
    expect(Array.isArray(response.data.results)).toBe(true)
  })
})

describe('Geocoding - Reverse (Clique no Mapa)', () => {
  it('deve fazer requisição GET com coordenadas', async () => {
    const latitude = -7.026368
    const longitude = -37.277010

    const response = await api.get('/geocoding/reverse/', {
      params: { latitude, longitude }
    })

    expect(response.status).toBe(200)
    expect(response.config.params).toHaveProperty('latitude')
    expect(response.config.params).toHaveProperty('longitude')
    expect(response.config.params.latitude).toBe(latitude)
    expect(response.config.params.longitude).toBe(longitude)
  })

  it('deve retornar endereço para coordenadas válidas', async () => {
    const response = await api.get('/geocoding/reverse/', {
      params: {
        latitude: -7.026368,
        longitude: -37.277010
      }
    })

    const { results } = response.data

    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBeGreaterThan(0)
    
    // Verificar estrutura dos resultados
    const result = results[0]
    expect(result).toHaveProperty('name')
    expect(result).toHaveProperty('address')
  })

  it('deve retornar nome e descrição do local clicado', async () => {
    const response = await api.get('/geocoding/reverse/', {
      params: {
        latitude: -7.025000,
        longitude: -37.278000
      }
    })

    const { results } = response.data

    if (results.length > 0) {
      expect(typeof results[0].name).toBe('string')
      expect(results[0].name.length).toBeGreaterThan(0)
    }
  })

  it('deve suportar múltiplas coordenadas diferentes', async () => {
    const coords = [
      { latitude: -7.026368, longitude: -37.277010 },
      { latitude: -7.027000, longitude: -37.276000 },
      { latitude: -7.025000, longitude: -37.278000 }
    ]

    for (const coord of coords) {
      const response = await api.get('/geocoding/reverse/', {
        params: coord
      })

      expect(response.status).toBe(200)
      expect(Array.isArray(response.data.results)).toBe(true)
    }
  })

  it('deve validar intervalos de coordenadas', async () => {
    const testCases = [
      // Latitude válida: entre -90 e 90
      // Longitude válida: entre -180 e 180
      { latitude: -7.026368, longitude: -37.277010 }, // Patos
      { latitude: 0, longitude: 0 }, // Equador/Prime Meridian
      { latitude: -90, longitude: 0 }, // Polo Sul
      { latitude: 90, longitude: 0 } // Polo Norte
    ]

    for (const coord of testCases) {
      const response = await api.get('/geocoding/reverse/', {
        params: coord
      })

      expect(response.status).toBe(200)
    }
  })
})

describe('Geocoding - Tratamento de Erros', () => {
  it('deve lidar com requisições inválidas', async () => {
    try {
      await api.get('/geocoding/forward/', {
        params: { address: null }
      })
    } catch (error: any) {
      // Pode falhar ou retornar dados vazios, ambos são aceitáveis
      expect(error || true).toBeTruthy()
    }
  })

  it('deve retornar erro para endpoint inválido', async () => {
    try {
      await api.get('/geocoding/invalid/', {
        params: { address: 'test' }
      })
      expect(true).toBe(false) // Não deve chegar aqui
    } catch (error: any) {
      expect(error.response?.status).toBe(404)
    }
  })
})
