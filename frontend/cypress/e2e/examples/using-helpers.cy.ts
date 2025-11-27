/**
 * Exemplos de uso dos helpers
 * 
 * Este arquivo demonstra como usar as funções helper
 * para escrever testes mais limpos e reutilizáveis
 */

import {
  generateUserData,
  generatePlaceData,
  generateEventData,
  waitForElement,
  fillForm,
  clearStorage,
  isAuthenticated,
  waitForToast,
  getPatosCoordinates,
  mockGeolocation,
} from '../support/helpers'

describe('Using Helpers Examples', () => {
  beforeEach(() => {
    clearStorage()
  })

  context('User Data Generation', () => {
    it('deve criar usuário com dados gerados', () => {
      const userData = generateUserData()
      
      cy.visit('/cadastro')
      
      cy.get('input[name="full_name"]').type(userData.name)
      cy.get('input[type="email"]').type(userData.email)
      cy.get('input[type="password"]').first().type(userData.password)
      cy.get('input[type="password"]').last().type(userData.password)
      
      cy.get('button[type="submit"]').click()
      
      // Verificar popup de sucesso
      cy.contains(/conta criada|sucesso/i, { timeout: 10000 }).should('be.visible')
      
      // Aguardar redirecionamento (5 segundos + margem)
      cy.url().should('include', '/entrar', { timeout: 8000 })
    })
  })

  context('Place Data Generation', () => {
    it('deve criar lugar com dados gerados', () => {
      const email = Cypress.env('TEST_USER_EMAIL')
      const password = Cypress.env('TEST_USER_PASSWORD')
      cy.login(email, password)
      
      const placeData = generatePlaceData()
      
      cy.visit('/pontos-turisticos/criar')
      
      cy.get('input[name="name"]').type(placeData.name)
      cy.get('textarea[name="description"]').type(placeData.description)
      cy.get('input[name="address"]').type(placeData.address)
      
      cy.get('button[type="submit"]').click()
      
      cy.url().should('not.include', '/criar', { timeout: 10000 })
    })
  })

  context('Event Data Generation', () => {
    it('deve criar evento com dados gerados', () => {
      const email = Cypress.env('TEST_USER_EMAIL')
      const password = Cypress.env('TEST_USER_PASSWORD')
      cy.login(email, password)
      
      const eventData = generateEventData()
      
      cy.visit('/eventos/criar')
      
      cy.get('input[name="name"]').type(eventData.name)
      cy.get('textarea[name="description"]').type(eventData.description)
      cy.get('input[name="address"]').type(eventData.address)
      
      // Preencher datas se existirem
      cy.get('body').then(($body) => {
        if ($body.find('input[type="date"]').length > 0) {
          const dateOnly = eventData.start_date.split('T')[0]
          cy.get('input[type="date"]').first().type(dateOnly)
        }
      })
      
      cy.get('button[type="submit"]').click()
      
      cy.url().should('not.include', '/criar', { timeout: 10000 })
    })
  })

  context('Wait For Element', () => {
    it('deve aguardar elemento estar pronto', () => {
      cy.visit('/pontos-turisticos')
      
      waitForElement('[class*="card"], [class*="item"], article')
      
      cy.get('[class*="card"], [class*="item"], article')
        .first()
        .should('be.visible')
        .click()
    })
  })

  context('Fill Form Helper', () => {
    it('deve preencher formulário automaticamente', () => {
      cy.visit('/entrar')
      
      fillForm({
        email: Cypress.env('TEST_USER_EMAIL'),
        password: Cypress.env('TEST_USER_PASSWORD'),
      })
      
      cy.get('button[type="submit"]').click()
      
      cy.url().should('not.include', '/entrar', { timeout: 10000 })
    })
  })

  context('Authentication Check', () => {
    it('deve verificar se usuário está autenticado', () => {
      cy.visit('/entrar')
      
      isAuthenticated().then((authenticated) => {
        expect(authenticated).to.be.false
      })
      
      const email = Cypress.env('TEST_USER_EMAIL')
      const password = Cypress.env('TEST_USER_PASSWORD')
      
      cy.get('input[type="email"]').type(email)
      cy.get('input[type="password"]').type(password)
      cy.get('button[type="submit"]').click()
      
      cy.wait(2000)
      
      isAuthenticated().then((authenticated) => {
        expect(authenticated).to.be.true
      })
    })
  })

  context('Toast Notifications', () => {
    it('deve aguardar toast aparecer', () => {
      const email = Cypress.env('TEST_USER_EMAIL')
      const password = Cypress.env('TEST_USER_PASSWORD')
      cy.login(email, password)
      
      const placeData = generatePlaceData()
      
      cy.visit('/pontos-turisticos/criar')
      
      cy.get('input[name="name"]').type(placeData.name)
      cy.get('textarea[name="description"]').type(placeData.description)
      cy.get('input[name="address"]').type(placeData.address)
      
      cy.get('button[type="submit"]').click()
      
      // Aguardar toast de sucesso
      waitForToast()
    })
  })

  context('Geolocation', () => {
    it('deve mockar geolocalização de Patos', () => {
      const coords = getPatosCoordinates()
      mockGeolocation(coords.latitude, coords.longitude)
      
      cy.visit('/mapa')
      
      // Verificar se mapa centralizou em Patos
      cy.get('.leaflet-container', { timeout: 10000 }).should('be.visible')
    })
  })

  context('Multiple Helpers Combined', () => {
    it('deve usar múltiplos helpers em um teste', () => {
      // Limpar storage
      clearStorage()
      
      // Gerar dados
      const userData = generateUserData()
      
      // Cadastrar
      cy.visit('/cadastro')
      
      fillForm({
        full_name: userData.name,
        email: userData.email,
      })
      
      cy.get('input[type="password"]').first().type(userData.password)
      cy.get('input[type="password"]').last().type(userData.password)
      
      cy.get('button[type="submit"]').click()
      
      // Verificar popup de sucesso
      cy.contains(/conta criada|sucesso/i, { timeout: 10000 }).should('be.visible')
      
      // Aguardar redirecionamento (5 segundos + margem)
      cy.url().should('include', '/entrar', { timeout: 8000 })
      
      // Fazer login
      cy.get('input[type="email"]').type(userData.email)
      cy.get('input[type="password"]').type(userData.password)
      cy.get('button[type="submit"]').click()
      
      // Aguardar autenticação
      cy.wait(2000)
      
      isAuthenticated().then((authenticated) => {
        expect(authenticated).to.be.true
      })
      
      // Criar lugar
      const placeData = generatePlaceData()
      
      cy.visit('/pontos-turisticos/criar')
      
      waitForElement('form')
      
      cy.get('input[name="name"]').type(placeData.name)
      cy.get('textarea[name="description"]').type(placeData.description)
      cy.get('input[name="address"]').type(placeData.address)
      
      cy.get('button[type="submit"]').click()
      
      // Aguardar toast
      waitForToast()
      
      // Verificar redirecionamento
      cy.url().should('not.include', '/criar', { timeout: 10000 })
    })
  })

  context('Conditional Actions', () => {
    it('deve executar ações condicionalmente', () => {
      cy.visit('/')
      
      // Verificar se está autenticado
      isAuthenticated().then((authenticated) => {
        if (!authenticated) {
          // Fazer login se não estiver autenticado
          cy.visit('/entrar')
          
          fillForm({
            email: Cypress.env('TEST_USER_EMAIL'),
            password: Cypress.env('TEST_USER_PASSWORD'),
          })
          
          cy.get('button[type="submit"]').click()
          cy.wait(2000)
        }
        
        // Agora está autenticado, pode acessar página protegida
        cy.visit('/favoritos')
        cy.url().should('include', '/favoritos')
      })
    })
  })

  context('Error Handling', () => {
    it('deve lidar com erros usando helpers', () => {
      cy.visit('/entrar')
      
      fillForm({
        email: 'invalido@email.com',
        password: 'senhaerrada',
      })
      
      cy.get('button[type="submit"]').click()
      
      // Aguardar mensagem de erro (pode ser toast ou inline)
      cy.wait(2000)
      
      cy.get('body').then(($body) => {
        const hasToast = $body.find('[role="alert"], [class*="toast"]').length > 0
        const hasError = $body.find('[class*="error"]').length > 0
        
        expect(hasToast || hasError).to.be.true
      })
    })
  })
})
