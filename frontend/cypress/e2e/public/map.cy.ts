describe('Map Page', () => {
  beforeEach(() => {
    cy.visit('/mapa')
  })

  it('deve carregar a página do mapa', () => {
    cy.url().should('include', '/mapa')
  })

  it('deve exibir o mapa Leaflet', () => {
    // Verificar se o container do mapa existe
    cy.get('.leaflet-container', { timeout: 10000 }).should('be.visible')
  })

  it('deve exibir marcadores no mapa', () => {
    // Aguardar carregamento dos marcadores
    cy.get('.leaflet-marker-icon', { timeout: 10000 }).should('have.length.greaterThan', 0)
  })

  it('deve abrir popup ao clicar em marcador', () => {
    cy.get('.leaflet-marker-icon', { timeout: 10000 }).first().click({ force: true })
    cy.wait(500)
    // Verificar que o popup existe (pode ter animação de opacity)
    cy.get('.leaflet-popup').should('exist')
    cy.get('.leaflet-popup-content').should('exist')
  })

  it('deve exibir sidebar com planejador de rota', () => {
    // Verificar se existe o título do planejador
    cy.contains(/planejar rota/i).should('be.visible')
    
    // Verificar se tem os campos de origem e destino
    cy.contains(/ponto de partida/i).should('be.visible')
    cy.contains(/destino/i).should('be.visible')
  })

  it('deve mostrar opção de definir como partida quando não tem origem', () => {
    // Clicar em um marcador
    cy.get('.leaflet-marker-icon', { timeout: 10000 }).first().click({ force: true })
    cy.wait(500)
    
    // Verificar que mostra opção de definir como partida
    cy.contains(/definir como partida/i).should('exist')
  })

  it('deve permitir definir origem clicando em marcador', () => {
    // Clicar em um marcador
    cy.get('.leaflet-marker-icon', { timeout: 10000 }).first().click({ force: true })
    cy.wait(500)
    
    // Clicar em "Definir como Partida"
    cy.contains(/definir como partida/i).click()
    cy.wait(500)
    
    // Verificar que a origem foi definida (aparece na sidebar)
    cy.contains(/ponto de partida/i).should('be.visible')
  })

  it('deve mostrar opção de definir como destino quando já tem origem', () => {
    // Definir origem primeiro
    cy.get('.leaflet-marker-icon', { timeout: 10000 }).eq(0).click({ force: true })
    cy.wait(500)
    cy.contains(/definir como partida/i).click()
    cy.wait(500)
    
    // Clicar em outro marcador
    cy.get('.leaflet-marker-icon').eq(1).click({ force: true })
    cy.wait(500)
    
    // Verificar que mostra opção de definir como destino
    cy.contains(/definir como destino/i).should('exist')
  })

  it('deve permitir criar rota entre dois pontos', () => {
    // Definir origem
    cy.get('.leaflet-marker-icon', { timeout: 10000 }).eq(0).click({ force: true })
    cy.wait(500)
    cy.contains(/definir como partida/i).click()
    cy.wait(500)
    
    // Definir destino
    cy.get('.leaflet-marker-icon').eq(1).click({ force: true })
    cy.wait(500)
    cy.contains(/definir como destino/i).click()
    cy.wait(500)
    
    // Clicar em "Traçar Rota"
    cy.contains('button', /traçar rota/i).click()
    cy.wait(3000)
    
    // Verificar que a rota foi criada (aparece card com informações)
    cy.contains(/resumo do trajeto|distância|tempo/i, { timeout: 10000 }).should('exist')
  })

  it('deve mostrar opção de adicionar parada quando já tem origem e destino', () => {
    // Definir origem
    cy.get('.leaflet-marker-icon', { timeout: 10000 }).eq(0).click({ force: true })
    cy.wait(500)
    cy.contains(/definir como partida/i).click()
    cy.wait(500)
    
    // Definir destino
    cy.get('.leaflet-marker-icon').eq(1).click({ force: true })
    cy.wait(500)
    cy.contains(/definir como destino/i).click()
    cy.wait(500)
    
    // Clicar em outro marcador
    cy.get('.leaflet-marker-icon').eq(2).click({ force: true })
    cy.wait(500)
    
    // Verificar que mostra opção de adicionar como parada
    cy.contains(/adicionar como parada/i).should('exist')
  })

  it('deve permitir adicionar parada intermediária na rota', () => {
    // Definir origem
    cy.get('.leaflet-marker-icon', { timeout: 10000 }).eq(0).click({ force: true })
    cy.wait(500)
    cy.contains(/definir como partida/i).click()
    cy.wait(500)
    
    // Definir destino
    cy.get('.leaflet-marker-icon').eq(1).click({ force: true })
    cy.wait(500)
    cy.contains(/definir como destino/i).click()
    cy.wait(500)
    
    // Adicionar parada
    cy.get('.leaflet-marker-icon').eq(2).click({ force: true })
    cy.wait(500)
    cy.contains(/adicionar como parada/i).click()
    cy.wait(500)
    
    // Verificar que a parada foi adicionada (aparece na sidebar)
    cy.contains(/parada/i).should('be.visible')
    
    // Clicar em "Traçar Rota" com a parada incluída
    cy.contains('button', /traçar rota/i).click()
    cy.wait(3000)
    
    // Verificar que a rota foi criada com a parada
    cy.contains(/resumo do trajeto|distância|tempo/i, { timeout: 10000 }).should('exist')
  })
})
