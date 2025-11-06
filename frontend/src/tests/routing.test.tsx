import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import MapPage from '@/pages/MapPage'

// Wrapper para incluir Router
const MapPageWithRouter = () => (
  <BrowserRouter>
    <MapPage />
  </BrowserRouter>
)

describe('MapPage - Rotas no Mapa', () => {
  it('deve carregar e exibir localizações no dropdown', async () => {
    const user = userEvent.setup()
    render(<MapPageWithRouter />)

    // Aguardar carregamento das localizações
    await waitFor(() => {
      expect(screen.queryByText('Carregando mapa...')).not.toBeInTheDocument()
    })

    // Clicar no primeiro botão de seleção
    const selectButtons = screen.getAllByRole('button', { name: /Selecionar local/ })
    await user.click(selectButtons[0])

    // Verificar se as localizações aparecem no dropdown
    await waitFor(() => {
      expect(screen.getByText('Praça Getúlio Vargas')).toBeInTheDocument()
      expect(screen.getByText('Igreja Matriz')).toBeInTheDocument()
      expect(screen.getByText('Museu do Cariri')).toBeInTheDocument()
    })
  })

  it('deve permitir selecionar dois pontos para criar rota', async () => {
    const user = userEvent.setup()
    render(<MapPageWithRouter />)

    await waitFor(() => {
      expect(screen.queryByText('Carregando mapa...')).not.toBeInTheDocument()
    })

    // Selecionar primeiro waypoint
    const selectButtons = screen.getAllByRole('button', { name: /Selecionar local/ })
    await user.click(selectButtons[0])

    let praçaButton = await screen.findByRole('button', { name: /Praça Getúlio Vargas/ })
    await user.click(praçaButton)

    // Selecionar segundo waypoint
    await user.click(selectButtons[1])

    let igrejButton = await screen.findByRole('button', { name: /Igreja Matriz/ })
    await user.click(igrejButton)

    // Botão de calcular rota deve estar habilitado
    const calculateButton = screen.getByRole('button', { name: /Calcular Rota/ })
    expect(calculateButton).not.toBeDisabled()
  })

  it('deve desabilitar botão calcular rota quando menos de 2 pontos selecionados', async () => {
    render(<MapPageWithRouter />)

    await waitFor(() => {
      expect(screen.queryByText('Carregando mapa...')).not.toBeInTheDocument()
    })

    const calculateButton = screen.getByRole('button', { name: /Calcular Rota/ })
    expect(calculateButton).toBeDisabled()
  })

  it('deve exibir botão adicionar parada', async () => {
    render(<MapPageWithRouter />)

    await waitFor(() => {
      expect(screen.queryByText('Carregando mapa...')).not.toBeInTheDocument()
    })

    // Clicar em adicionar parada
    const addButton = screen.getByRole('button', { name: /Adicionar Parada/ })
    expect(addButton).toBeInTheDocument()
  })

  it('deve exibir legenda no mapa', async () => {
    render(<MapPageWithRouter />)

    await waitFor(() => {
      expect(screen.queryByText('Carregando mapa...')).not.toBeInTheDocument()
    })

    // Verificar se a legenda existe
    expect(screen.getByText('Legenda')).toBeInTheDocument()
    expect(screen.getByText('Rota')).toBeInTheDocument()
  })
})
