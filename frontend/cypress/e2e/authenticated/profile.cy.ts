describe('Profile Page (Authenticated)', () => {
  beforeEach(() => {
    const email = Cypress.env('TEST_USER_EMAIL')
    const password = Cypress.env('TEST_USER_PASSWORD')
    cy.login(email, password)
    
    cy.visit('/perfil')
  })

  it('deve carregar página de perfil', () => {
    cy.url().should('include', '/perfil')
  })

  it('deve exibir informações do usuário', () => {
    cy.url().should('include', '/perfil')
    
    // Verificar se exibe o email do usuário
    cy.contains(Cypress.env('TEST_USER_EMAIL')).should('be.visible')
    
    // Verificar se tem o nome do usuário
    cy.get('h1').should('be.visible')
  })

  it('deve ter formulário de edição de perfil', () => {
    // Verificar que tem inputs de formulário
    cy.get('input[type="email"]').should('exist')
    cy.get('input').should('have.length.greaterThan', 0)
    
    // Verificar botão de salvar
    cy.contains('button', /salvar/i).should('be.visible')
  })

  it('deve ter abas de navegação', () => {
    // Verificar se tem as abas
    cy.contains(/dados pessoais/i).should('be.visible')
    cy.contains(/segurança/i).should('be.visible')
  })

  it('deve alternar entre abas', () => {
    // Clicar na aba Segurança
    cy.contains(/segurança/i).click()
    cy.wait(500)
    
    // Verificar que mostra campos de senha
    cy.contains(/senha atual|nova senha/i).should('be.visible')
    
    // Voltar para Dados Pessoais
    cy.contains(/dados pessoais/i).click()
    cy.wait(500)
    
    // Verificar que mostra campos de perfil
    cy.get('input[type="email"]').should('be.visible')
  })

  it('deve permitir editar nome do usuário', () => {
    // Encontrar o input de nome completo (pelo label)
    cy.contains('label', /nome completo/i).parent().find('input').clear().type('Nome Atualizado Teste')
    
    // Clicar em salvar
    cy.contains('button', /salvar/i).click()
    
    // Verificar feedback de sucesso
    cy.contains(/sucesso|atualizado/i, { timeout: 5000 }).should('be.visible')
  })

  it('deve acessar perfil pelo menu do navbar', () => {
    // Ir para home
    cy.visit('/')
    cy.wait(1000)
    
    // Clicar no botão do usuário no navbar (tem o ícone User e ChevronDown)
    cy.get('button[title="Opções do usuário"]').click()
    
    // Clicar em "Meu Perfil" no dropdown
    cy.contains(/meu perfil/i).click()
    
    // Verificar que está na página de perfil
    cy.url().should('include', '/perfil')
  })

  it('deve fazer logout pelo menu do navbar', () => {
    // Ir para home
    cy.visit('/')
    cy.wait(1000)
    
    // Clicar no botão do usuário no navbar
    cy.get('button[title="Opções do usuário"]').click()
    
    // Clicar em "Sair" no dropdown
    cy.contains(/sair/i).click()
    
    // Verificar redirecionamento
    cy.url().should('include', '/entrar')
    
    // Verificar que token foi removido
    cy.window().its('localStorage').invoke('getItem', 'access_token').should('not.exist')
  })

  it('deve redirecionar para login se não autenticado', () => {
    cy.logout()
    cy.visit('/perfil')
    cy.url().should('include', '/entrar')
  })
})
