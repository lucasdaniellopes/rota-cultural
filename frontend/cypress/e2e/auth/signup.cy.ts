describe('Signup Page', () => {
  beforeEach(() => {
    cy.visit('/cadastro')
  })

  // Flag para controlar se o usuário de teste já foi criado
  let testUserCreated = false

  it('deve exibir o formulário de cadastro', () => {
    cy.contains('h1, h2', /cadastr|registr|criar/i).should('be.visible')
    cy.get('input[name="full_name"]').should('be.visible')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('deve validar campos obrigatórios', () => {
    cy.get('button[type="submit"]').click()
    
    // Verificar validação
    cy.get('input:invalid').should('have.length.greaterThan', 0)
  })

  it('deve validar formato de email', () => {
    cy.get('input[type="email"]').type('emailinvalido')
    cy.get('button[type="submit"]').click()
    
    cy.get('input[type="email"]:invalid').should('exist')
  })

  it('deve validar senha forte', () => {
    cy.get('input[name="full_name"]').type('Teste User')
    cy.get('input[type="email"]').type('teste@email.com')
    cy.get('input[type="password"]').first().type('123')
    cy.get('button[type="submit"]').click()
    
    // Verificar mensagem de senha fraca
    cy.contains(/senha|password|fraca|curta|caracteres/i, { timeout: 3000 })
  })

  it('deve validar confirmação de senha', () => {
    cy.get('input[name="full_name"]').type('Teste User')
    cy.get('input[type="email"]').type('teste@email.com')
    cy.get('input[type="password"]').first().type('senha123')
    cy.get('input[type="password"]').last().type('senha456')
    cy.get('button[type="submit"]').click()
    
    // Verificar mensagem de senhas não conferem
    cy.contains(/senha|não conferem|coincidem/i, { timeout: 3000 })
  })

  it('deve cadastrar novo usuário com sucesso', () => {
    // Usar credenciais do cypress.env.json para criar usuário de teste
    // Este usuário será usado nos testes de login
    const testUser = {
      name: 'Usuário Teste',
      email: Cypress.env('TEST_USER_EMAIL'),
      password: Cypress.env('TEST_USER_PASSWORD'),
    }
    
    cy.get('input[name="full_name"]').type(testUser.name)
    cy.get('input[type="email"]').type(testUser.email)
    cy.get('input[type="password"]').first().type(testUser.password)
    cy.get('input[type="password"]').last().type(testUser.password)
    cy.get('button[type="submit"]').click()
    
    // Aguardar que o cadastro seja processado e popup apareça
    cy.wait(2000)
    
    // Verificar se popup de sucesso apareceu OU se já redirecionou
    cy.url({ timeout: 10000 }).should('satisfy', (url) => {
      return url.includes('/entrar') || url.includes('/cadastro')
    })
    
    // Se ainda estiver na página de cadastro, aguardar redirecionamento
    cy.url().then((url) => {
      if (url.includes('/cadastro')) {
        cy.contains(/conta criada|sucesso/i, { timeout: 3000 }).should('be.visible')
        cy.url().should('include', '/entrar', { timeout: 6000 })
      }
    })
  })

  it('deve mostrar erro ao cadastrar email já existente', () => {
    const email = Cypress.env('TEST_USER_EMAIL')
    
    cy.get('input[name="full_name"]').type('Teste User')
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').first().type('SenhaForte@123')
    cy.get('input[type="password"]').last().type('SenhaForte@123')
    cy.get('button[type="submit"]').click()
    
    // Verificar mensagem de erro
    cy.contains(/já existe|já cadastrado|email em uso/i, { timeout: 5000 })
  })

  it('deve ter link para login', () => {
    cy.contains(/já tem conta|fazer login|entrar/i).should('be.visible').click()
    cy.url().should('include', '/entrar')
  })
})
