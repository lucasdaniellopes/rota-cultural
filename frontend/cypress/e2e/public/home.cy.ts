describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('deve carregar a página inicial', () => {
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.get('body').should('be.visible')
  })

  it('deve exibir o navbar', () => {
    cy.get('nav').should('be.visible')
  })

  it('deve exibir o footer', () => {
    cy.get('footer').should('be.visible')
  })

  it('deve ter link para mapa', () => {
    cy.contains(/mapa|map/i).click()
    cy.url().should('include', '/mapa')
  })

  it('deve ter link para pontos turísticos', () => {
    cy.contains(/pontos turísticos|lugares|locais/i).click()
    cy.url().should('include', '/pontos-turisticos')
  })

  it('deve ter link para eventos', () => {
    cy.contains(/eventos|agenda/i).click()
    cy.url().should('include', '/eventos')
  })

  it('deve ter botão de login quando não autenticado', () => {
    cy.contains(/entrar|login/i).should('be.visible')
  })

  it('deve exibir conteúdo principal da home', () => {
    // Verificar título ou hero section
    cy.contains(/rota cultural|patos|bem-vindo/i).should('be.visible')
  })
})
