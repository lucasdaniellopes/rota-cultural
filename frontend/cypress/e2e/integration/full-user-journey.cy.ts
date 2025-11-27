describe('Full User Journey', () => {
  const timestamp = Date.now()
  const testUser = {
    name: 'Usuário Jornada',
    username: `usuario_jornada_${timestamp}`,
    email: `jornada_${timestamp}@teste.com`,
    password: 'Senha@123',
  }

  it('deve completar jornada completa do usuário', () => {
    // 1. VISITAR HOME
    cy.visit('/')
    cy.contains(/rota cultural|patos/i).should('be.visible')
    
    // 2. EXPLORAR MAPA
    cy.contains(/mapa/i).click()
    cy.url().should('include', '/mapa')
    cy.get('.leaflet-container', { timeout: 10000 }).should('be.visible')
    
    // 3. VER LISTAGEM DE PONTOS TURÍSTICOS
    cy.visit('/pontos-turisticos')
    cy.wait(2000)
    cy.contains(/pontos turísticos/i).should('be.visible')
    
    // 4. VER DETALHES DE UM PONTO (se houver)
    cy.get('body').then(($body) => {
      if ($body.text().includes('Ver Detalhes')) {
        cy.contains(/ver detalhes/i).first().click()
        cy.url().should('match', /\/pontos-turisticos\/\d+/)
        cy.get('h1, h2').should('be.visible')
        
        // Voltar para listagem
        cy.visit('/pontos-turisticos')
      }
    })
    
    // 5. IR PARA LOGIN
    cy.visit('/entrar')
    
    // 6. IR PARA CADASTRO
    cy.contains(/crie uma/i).click()
    cy.url().should('include', '/cadastro')
    
    // 7. CADASTRAR NOVO USUÁRIO
    cy.get('input#full_name').type(testUser.name)
    cy.get('input#email').type(testUser.email)
    cy.get('input#password').type(testUser.password)
    cy.get('input#password_confirm').type(testUser.password)
    cy.get('button[type="submit"]').click()
    
    // Verificar popup de sucesso
    cy.contains(/conta criada|sucesso/i, { timeout: 10000 }).should('be.visible')
    
    // Aguardar e ir para login
    cy.wait(2000)
    cy.visit('/entrar')
    
    // 8. FAZER LOGIN COM A CONTA CRIADA
    cy.get('input#email').type(testUser.email)
    cy.get('input#password').type(testUser.password)
    cy.get('button[type="submit"]').click()
    
    // Aguardar login
    cy.url().should('not.include', '/entrar', { timeout: 5000 })
    
    // Verificar se está logado
    cy.window().its('localStorage').invoke('getItem', 'access_token').should('exist')
    
    // 9. CRIAR NOVO PONTO TURÍSTICO
    cy.visit('/pontos-turisticos/criar')
    cy.wait(1500)
    
    const newPlace = {
      name: `Ponto Jornada ${timestamp}`,
      description: 'Ponto turístico criado durante teste de jornada completa',
      address: 'Rua Teste, 123, Patos - PB',
    }
    
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
    
    // Preencher horários de funcionamento
    cy.get('input#opening_time').type('08:00')
    cy.get('input#closing_time').type('18:00')
    
    cy.contains('button', /criar|salvar/i).click()
    cy.wait(3000)
    
    // 10. CRIAR ROTA NO MAPA
    cy.visit('/mapa')
    cy.wait(2000)
    
    // Definir origem clicando em marcador
    cy.get('.leaflet-marker-icon', { timeout: 10000 }).eq(0).click({ force: true })
    cy.wait(500)
    cy.contains(/definir como partida/i).click()
    cy.wait(500)
    
    // Definir destino clicando em outro marcador
    cy.get('.leaflet-marker-icon').eq(1).click({ force: true })
    cy.wait(500)
    cy.contains(/definir como destino/i).click()
    cy.wait(500)
    
    // Traçar rota
    cy.contains('button', /traçar rota/i).click()
    cy.wait(3000)
    
    // Verificar que a rota foi criada
    cy.contains(/resumo do trajeto|distância/i, { timeout: 10000 }).should('exist')
    
    // 11. VERIFICAR FAVORITOS
    cy.visit('/favoritos')
    cy.url().should('include', '/favoritos')
    cy.wait(1500)
    
    // 12. VER MINHAS AVALIAÇÕES
    cy.visit('/avaliacoes')
    cy.url().should('include', '/avaliacoes')
    cy.wait(1500)
    
    // 13. EDITAR PERFIL - ALTERAR NOME
    cy.visit('/perfil')
    cy.url().should('include', '/perfil')
    cy.wait(1000)
    
    // Editar nome
    cy.contains('label', /nome completo/i).parent().find('input').clear().type('Nome Atualizado Jornada')
    cy.contains('button', /salvar/i).click()
    cy.wait(1500)
    
    // Verificar feedback de sucesso
    cy.contains(/sucesso|atualizado/i, { timeout: 5000 }).should('be.visible')
    
    // 14. FAZER LOGOUT PELO NAVBAR
    cy.visit('/')
    cy.wait(1000)
    cy.get('button[title="Opções do usuário"]').click()
    cy.contains(/sair/i).click()
    
    cy.url().should('include', '/entrar')
    cy.window().its('localStorage').invoke('getItem', 'access_token').should('not.exist')
    
    // 15. FAZER LOGIN NOVAMENTE
    cy.get('input#email').type(testUser.email)
    cy.get('input#password').type(testUser.password)
    cy.get('button[type="submit"]').click()
    
    cy.url().should('not.include', '/entrar', { timeout: 10000 })
    cy.window().its('localStorage').invoke('getItem', 'access_token').should('exist')
  })
})
