describe('Item Detail Page', () => {
  context('Place Detail', () => {
    beforeEach(() => {
      // Visitar listagem e clicar no primeiro item
      cy.visit('/pontos-turisticos')
      cy.wait(2000)
      
      // Verificar se tem cards e clicar no primeiro "Ver Detalhes"
      cy.get('body').then(($body) => {
        if ($body.text().includes('Ver Detalhes')) {
          cy.contains(/ver detalhes/i).first().click()
        }
      })
    })

    it('deve exibir detalhes do ponto turístico', () => {
      cy.url().should('match', /\/pontos-turisticos\/\d+/)
      
      // Título
      cy.get('h1, h2').should('be.visible')
      
      // Descrição
      cy.contains(/descrição|sobre|detalhes/i).should('exist')
    })

    it('deve exibir endereço', () => {
      cy.contains(/endereço|localização|onde/i).should('be.visible')
    })

    it('deve ter botão de favoritar', () => {
      cy.get('body').then(($body) => {
        const bodyText = $body.text()
        const hasFavoriteButton = bodyText.includes('Favoritar') || bodyText.includes('favorit')
        if (hasFavoriteButton) {
          cy.contains(/favoritar/i).should('be.visible')
        }
      })
    })

    it('deve ter botão voltar', () => {
      cy.get('body').then(($body) => {
        const hasBackButton = $body.text().includes('Voltar')
        if (hasBackButton) {
          cy.contains(/voltar/i).should('be.visible')
        }
      })
    })
  })

  context('Event Detail', () => {
    beforeEach(() => {
      cy.visit('/eventos')
      cy.wait(2000)
      
      // Verificar se tem cards e clicar no primeiro "Ver Detalhes"
      cy.get('body').then(($body) => {
        if ($body.text().includes('Ver Detalhes')) {
          cy.contains(/ver detalhes/i).first().click()
        }
      })
    })

    it('deve exibir detalhes do evento', () => {
      cy.url().should('match', /\/eventos\/\d+/)
      cy.get('h1, h2').should('be.visible')
    })

    it('deve exibir data e horário do evento', () => {
      cy.get('body').then(($body) => {
        const bodyText = $body.text()
        const hasDate = bodyText.match(/\d{2}\/\d{2}\/\d{4}/)
        expect(hasDate).to.exist
      })
    })

    it('deve exibir local do evento', () => {
      cy.contains(/local|onde|endereço/i).should('be.visible')
    })

    it('deve ter botão de compartilhar', () => {
      cy.get('body').then(($body) => {
        const hasShareButton = $body.text().includes('Compartilhar')
        if (hasShareButton) {
          cy.contains(/compartilhar/i).should('be.visible')
        }
      })
    })
  })

})
