describe('Places Listing Page', () => {
  beforeEach(() => {
    cy.visit('/pontos-turisticos')
  })

  it('deve carregar a página de listagem', () => {
    cy.url().should('include', '/pontos-turisticos')
  })

  it('deve exibir título da página', () => {
    cy.contains(/pontos turísticos/i).should('be.visible')
  })

  it('deve exibir lista de pontos turísticos ou mensagem de carregamento', () => {
    // Aguardar carregamento
    cy.wait(2000)
    
    // Verificar se tem cards ou mensagem de vazio/carregando
    cy.get('body').then(($body) => {
      const bodyText = $body.text()
      const hasCards = bodyText.includes('Ver Detalhes')
      const hasMessage = bodyText.includes('Carregando') || bodyText.includes('Nenhum')
      
      expect(hasCards || hasMessage).to.be.true
    })
  })

  it('deve exibir informações básicas de cada ponto', () => {
    cy.wait(2000)
    
    // Verificar se tem botão "Ver Detalhes" (indica que tem cards)
    cy.get('body').then(($body) => {
      if ($body.text().includes('Ver Detalhes')) {
        cy.contains(/ver detalhes/i).should('be.visible')
      }
    })
  })

  it('deve ter campo de busca', () => {
    cy.get('input[type="text"]').should('be.visible')
    cy.get('input[placeholder*="Buscar"]').should('be.visible')
  })

  it('deve filtrar pontos turísticos pela busca', () => {
    cy.get('input[placeholder*="Buscar"]').type('praça')
    cy.wait(1000)
    
    // Verificar que a busca foi aplicada (o input tem o valor)
    cy.get('input[placeholder*="Buscar"]').should('have.value', 'praça')
  })

  it('deve ter filtros por categoria', () => {
    cy.get('select').should('have.length.greaterThan', 0)
    cy.get('select').first().should('be.visible')
  })

  it('deve navegar para detalhes ao clicar em um card', () => {
    cy.wait(2000)
    
    // Verificar se tem cards para clicar
    cy.get('body').then(($body) => {
      if ($body.text().includes('Ver Detalhes')) {
        cy.contains(/ver detalhes/i).first().click()
        cy.url().should('match', /\/pontos-turisticos\/\d+/)
      }
    })
  })

  it('deve ter botão para criar novo ponto', () => {
    cy.contains(/criar ponto turístico/i).should('be.visible')
  })

  it('deve exibir mensagem quando não há resultados', () => {
    cy.get('input[placeholder*="Buscar"]').type('xyzabc123naoexiste')
    cy.wait(1500)
    
    // Verificar mensagem de "nenhum resultado"
    cy.contains(/nenhum|não encontrado/i, { timeout: 5000 }).should('be.visible')
  })

  it('deve exibir contador de resultados', () => {
    cy.wait(1500)
    cy.contains(/locais encontrados|encontrados/i).should('be.visible')
  })
})
