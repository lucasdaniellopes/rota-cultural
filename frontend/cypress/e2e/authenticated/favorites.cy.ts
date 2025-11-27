describe('Favorites Page (Authenticated)', () => {
  beforeEach(() => {
    const email = Cypress.env('TEST_USER_EMAIL')
    const password = Cypress.env('TEST_USER_PASSWORD')
    cy.login(email, password)
  })

  it('deve mostrar mensagem quando não há favoritos', () => {
    cy.visit('/favoritos')
    cy.url().should('include', '/favoritos')
    
    // Aguardar carregamento
    cy.wait(2000)
    
    // Verificar mensagem de vazio
    cy.contains(/nenhum favorito ainda|nenhum local salvo|nenhum evento salvo/i).should('be.visible')
  })

  it('deve adicionar favorito e exibir na lista', () => {
    // Ir para listagem de eventos
    cy.visit('/eventos')
    cy.wait(2000)
    
    // Clicar no botão "Ver Detalhes" do primeiro card
    cy.contains('button', /ver detalhes/i).first().click()
    cy.wait(1000)
    
    // Verificar que está na página de detalhes
    cy.url().should('match', /\/eventos\/\d+/)
    
    // Clicar no botão de favoritar (ícone de coração)
    cy.get('button[title*="favorito"]').click()
    cy.wait(1000)
    
    // Ir para página de favoritos
    cy.visit('/favoritos')
    cy.wait(2000)
    
    // Agora deve ter pelo menos 1 favorito
    cy.contains(/nenhum favorito ainda/i).should('not.exist')
    
    // Deve ter o botão "Ver Detalhes"
    cy.contains(/ver detalhes/i).should('be.visible')
  })

  it('deve ter filtros por tipo', () => {
    cy.visit('/favoritos')
    cy.wait(1000)
    
    // Verificar se tem as abas de filtro
    cy.contains(/todos/i).should('be.visible')
    cy.contains(/pontos turísticos/i).should('be.visible')
    cy.contains(/eventos/i).should('be.visible')
  })

  it('deve remover favorito', () => {
    // Ir para favoritos (já deve ter o favorito do teste anterior)
    cy.visit('/favoritos')
    cy.wait(2000)
    
    // Verificar se tem favorito
    cy.get('body').then(($body) => {
      if ($body.text().includes('Ver Detalhes')) {
        // Tem favorito, pode remover
        
        // Interceptar o confirm
        cy.window().then((win) => {
          cy.stub(win, 'confirm').returns(true)
        })
        
        // Clicar no botão de remover (tem title="Remover")
        cy.get('button[title="Remover"]').first().click()
        
        cy.wait(2000)
        
        // Verificar que foi removido
        cy.contains(/nenhum favorito ainda/i, { timeout: 5000 }).should('be.visible')
      } else {
        // Não tem favorito, pular teste
        cy.log('Nenhum favorito para remover')
      }
    })
  })

  it('deve redirecionar para login se não autenticado', () => {
    cy.logout()
    cy.visit('/favoritos')
    cy.url().should('include', '/entrar')
  })
})
