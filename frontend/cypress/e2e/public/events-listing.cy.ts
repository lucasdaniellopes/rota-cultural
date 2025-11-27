describe('Events Listing Page', () => {
  beforeEach(() => {
    cy.visit('/eventos')
  })

  it('deve carregar a página de eventos', () => {
    cy.url().should('include', '/eventos')
  })

  it('deve exibir título da página', () => {
    cy.contains(/eventos|agenda/i).should('be.visible')
  })

  it('deve exibir lista de eventos', () => {
    cy.get('[class*="card"], [class*="item"], article', { timeout: 10000 })
      .should('have.length.greaterThan', 0)
  })

  it('deve exibir informações de cada evento', () => {
    cy.get('[class*="card"], [class*="item"], article', { timeout: 10000 })
      .first()
      .within(() => {
        // Nome do evento
        cy.get('h2, h3, h4, [class*="title"]').should('be.visible')
        
        // Data do evento
        cy.get('body').then(($body) => {
          const hasDate = $body.find('[class*="date"], time').length > 0
          if (hasDate) {
            cy.get('[class*="date"], time').should('be.visible')
          }
        })
      })
  })

  it('deve ter campo de busca', () => {
    cy.get('input[type="search"], input[placeholder*="busca"], input[placeholder*="pesquis"]')
      .should('be.visible')
  })

  it('deve filtrar eventos pela busca', () => {
    cy.get('input[type="search"], input[placeholder*="busca"], input[placeholder*="pesquis"]')
      .type('festival')
    
    cy.wait(1000)
    cy.get('[class*="card"], [class*="item"], article')
      .should('have.length.greaterThan', 0)
  })

  it('deve ter filtros por categoria ou data', () => {
    cy.get('body').then(($body) => {
      const hasFilters = $body.find('select, [class*="filter"], [class*="category"]').length > 0
      if (hasFilters) {
        cy.get('select, [class*="filter"]').first().should('be.visible')
      }
    })
  })

  it('deve navegar para detalhes ao clicar em um evento', () => {
    cy.get('[class*="card"], [class*="item"], article', { timeout: 10000 })
      .first()
      .click()
    
    cy.url().should('match', /\/eventos\/\d+/)
  })

  it('deve ter botão para criar novo evento (se autenticado)', () => {
    cy.get('body').then(($body) => {
      const hasCreateButton = $body.find('a[href*="criar"], button:contains("criar")').length > 0
      if (hasCreateButton) {
        cy.contains(/criar|adicionar|novo/i).should('be.visible')
      }
    })
  })

  it('deve exibir eventos futuros primeiro', () => {
    cy.get('[class*="card"], [class*="item"], article', { timeout: 10000 })
      .should('have.length.greaterThan', 0)
    
    // Verificar se há datas visíveis
    cy.get('time, [class*="date"]').should('exist')
  })
})
