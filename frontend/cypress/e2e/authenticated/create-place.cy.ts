describe('Create Place (Authenticated)', () => {
  beforeEach(() => {
    // Login antes de cada teste
    const email = Cypress.env('TEST_USER_EMAIL')
    const password = Cypress.env('TEST_USER_PASSWORD')
    cy.login(email, password)
    
    cy.visit('/pontos-turisticos/criar')
    cy.wait(1500)
  })

  it('deve exibir formulário de criação', () => {
    cy.url().should('include', '/pontos-turisticos/criar')
    cy.get('form').should('be.visible')
  })

  it('deve ter campos obrigatórios', () => {
    cy.get('input#name').should('be.visible')
    cy.get('textarea#description').should('be.visible')
    cy.get('select#category').should('be.visible')
    cy.get('input#opening_time').should('be.visible')
    cy.get('input#closing_time').should('be.visible')
  })

  it('deve ter campo de busca de localização', () => {
    cy.get('input[placeholder*="endereço"]').should('be.visible')
  })

  it('deve permitir upload de imagem', () => {
    cy.get('input[type="file"]').should('exist')
  })

  it('deve ter botão cancelar', () => {
    cy.contains(/cancelar/i).should('be.visible')
  })

  it('deve criar novo ponto turístico com sucesso', () => {
    const timestamp = Date.now()
    const newPlace = {
      name: `Ponto Teste ${timestamp}`,
      description: 'Descrição do ponto turístico de teste',
    }

    // Preencher campos obrigatórios
    cy.get('input#name').type(newPlace.name)
    cy.get('textarea#description').type(newPlace.description)
    
    // Buscar e selecionar localização
    cy.get('input[placeholder*="endereço"]').type('Patos')
    cy.wait(1500)
    cy.get('body').then(($body) => {
      if ($body.text().includes('Patos')) {
        cy.contains(/patos/i).first().click()
      }
    })
    cy.wait(500)
    
    // Selecionar categoria
    cy.get('select#category').select(1)
    
    // Preencher horários
    cy.get('input#opening_time').type('09:00')
    cy.get('input#closing_time').type('17:00')
    
    // Submeter formulário
    cy.contains('button', /criar|salvar/i).click()
    cy.wait(3000)
    
    // Verificar redirecionamento ou mensagem de sucesso
    cy.url().should('not.include', '/criar')
  })

  it('deve validar campos obrigatórios', () => {
    // Tentar submeter sem preencher
    cy.contains('button', /criar|salvar/i).click()
    
    // Verificar mensagem de erro ou validação
    cy.wait(1000)
    cy.url().should('include', '/criar')
  })

  it('deve redirecionar para login se não autenticado', () => {
    cy.logout()
    cy.visit('/pontos-turisticos/criar')
    cy.url().should('include', '/entrar')
  })
})
