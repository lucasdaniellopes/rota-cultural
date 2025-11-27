describe('Create Event (Authenticated)', () => {
  beforeEach(() => {
    const email = Cypress.env('TEST_USER_EMAIL')
    const password = Cypress.env('TEST_USER_PASSWORD')
    cy.login(email, password)
    
    cy.visit('/eventos/criar')
    cy.wait(1500)
  })

  it('deve exibir formulário de criação de evento', () => {
    cy.url().should('include', '/eventos/criar')
    cy.get('form').should('be.visible')
  })

  it('deve ter campos específicos de evento', () => {
    cy.get('input#name').should('be.visible')
    cy.get('textarea#description').should('be.visible')
    cy.get('select#category').should('be.visible')
    
    // Campos de data e hora
    cy.get('input#start_date').should('be.visible')
    cy.get('input#end_date').should('be.visible')
    cy.get('input#start_time').should('be.visible')
    cy.get('input#end_time').should('be.visible')
    
    // Campo de preço
    cy.get('input#price').should('be.visible')
  })

  it('deve ter campo de busca de localização', () => {
    cy.get('input[placeholder*="endereço"]').should('be.visible')
  })

  it('deve ter botão cancelar', () => {
    cy.contains(/cancelar/i).should('be.visible')
  })

  it('deve criar novo evento com sucesso', () => {
    const timestamp = Date.now()
    const newEvent = {
      name: `Evento Teste ${timestamp}`,
      description: 'Descrição do evento de teste',
    }

    // Preencher campos obrigatórios
    cy.get('input#name').type(newEvent.name)
    cy.get('textarea#description').type(newEvent.description)
    
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
    
    // Preencher datas
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const formatDate = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${day}/${month}/${year}`
    }
    
    cy.get('input#start_date').type(formatDate(today))
    cy.get('input#end_date').type(formatDate(tomorrow))
    
    // Preencher horários
    cy.get('input#start_time').type('14:00')
    cy.get('input#end_time').type('18:00')
    
    // Preencher preço
    cy.get('input#price').type('0')
    
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
    cy.visit('/eventos/criar')
    cy.url().should('include', '/entrar')
  })
})
