describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/entrar')
  })

  it('deve exibir o formulário de login', () => {
    cy.contains('h1, h2', /bem-vindo|entrar|login/i).should('be.visible')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('deve mostrar erro com credenciais inválidas', () => {
    cy.get('input[type="email"]').type('invalido@email.com')
    cy.get('input[type="password"]').type('senhaerrada')
    cy.get('button[type="submit"]').click()
    
    // Verificar mensagem de erro
    cy.contains(/credenciais inválidas|erro|falha/i, { timeout: 5000 }).should('be.visible')
  })

  it('deve fazer login com credenciais válidas', () => {
    // Usar credenciais do usuário criado no teste de signup
    const email = Cypress.env('TEST_USER_EMAIL')
    const password = Cypress.env('TEST_USER_PASSWORD')
    
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.get('button[type="submit"]').click()
    
    // Verificar redirecionamento
    cy.url().should('not.include', '/entrar', { timeout: 5000 })
    
    // Verificar token no localStorage
    cy.window().its('localStorage').invoke('getItem', 'access_token').should('exist')
  })

  it('deve validar campos obrigatórios', () => {
    cy.get('button[type="submit"]').click()
    
    // Verificar validação HTML5 ou mensagens de erro
    cy.get('input[type="email"]:invalid').should('exist')
  })

  it('deve ter link para cadastro', () => {
    cy.contains(/crie uma|criar conta|cadastr/i).should('be.visible').click()
    cy.url().should('include', '/cadastro')
  })

  it('deve ter link para recuperar senha', () => {
    cy.contains(/esquec|recuperar senha/i).should('be.visible').click()
    cy.url().should('include', '/recuperar-senha')
  })
})
