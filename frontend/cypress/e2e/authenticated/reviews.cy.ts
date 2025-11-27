describe('Reviews Page (Authenticated)', () => {
  beforeEach(() => {
    const email = Cypress.env('TEST_USER_EMAIL')
    const password = Cypress.env('TEST_USER_PASSWORD')
    cy.login(email, password)
    
    cy.visit('/avaliacoes')
  })

  it('deve carregar página de avaliações', () => {
    cy.url().should('include', '/avaliacoes')
  })

  it('deve exibir título da página', () => {
    cy.contains(/avaliações|reviews|minhas avaliações/i).should('be.visible')
  })

  it('deve exibir lista de avaliações ou mensagem vazia', () => {
    // Aguardar carregamento
    cy.wait(1500)
    
    // Verificar se a página carregou
    cy.get('body').should('be.visible')
    
    // Verificar se tem reviews (procurar por botão "Útil" que sempre aparece) ou mensagem vazia
    cy.get('body').then(($body) => {
      const bodyText = $body.text()
      const hasReviews = bodyText.includes('Útil') || $body.find('button:contains("Útil")').length > 0
      const hasEmptyMessage = bodyText.includes('Nenhuma avaliação encontrada')
      
      expect(hasReviews || hasEmptyMessage).to.be.true
    })
  })

  it('deve exibir informações de cada avaliação', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[class*="review"], [class*="card"], article').length > 0) {
        cy.get('[class*="review"], [class*="card"], article')
          .first()
          .within(() => {
            // Verificar rating
            cy.get('[class*="rating"], [class*="star"]').should('exist')
            
            // Verificar comentário
            cy.get('p, [class*="comment"]').should('exist')
          })
      }
    })
  })

  it('deve permitir editar avaliação', () => {
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("editar")').length > 0) {
        cy.contains(/editar/i).first().click()
        
        // Verificar se abre modal ou formulário
        cy.get('textarea, input').should('be.visible')
      }
    })
  })

  it('deve permitir excluir avaliação', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[class*="review"], [class*="card"], article').length > 0) {
        const initialCount = $body.find('[class*="review"], [class*="card"], article').length
        
        cy.contains(/excluir|remover|deletar/i).first().click()
        
        // Confirmar exclusão
        cy.get('body').then(($confirmBody) => {
          if ($confirmBody.find('button:contains("confirmar")').length > 0) {
            cy.contains(/confirmar|sim/i).click()
          }
        })
        
        cy.wait(1000)
        
        // Verificar se foi removida
        cy.get('[class*="review"], [class*="card"], article')
          .should('have.length.lessThan', initialCount)
      }
    })
  })

  it('deve navegar para o item avaliado', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[class*="review"], [class*="card"], article').length > 0) {
        cy.get('[class*="review"], [class*="card"], article').first().click()
        cy.url().should('match', /\/(pontos-turisticos|eventos)\/\d+/)
      }
    })
  })

  it('deve redirecionar para login se não autenticado', () => {
    cy.logout()
    cy.visit('/avaliacoes')
    cy.url().should('include', '/entrar')
  })
})
