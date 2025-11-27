/**
 * Helper functions para testes Cypress
 * 
 * Funções utilitárias que podem ser usadas em qualquer teste
 */

/**
 * Gera um email único para testes
 */
export const generateUniqueEmail = (): string => {
  const timestamp = Date.now()
  return `teste_${timestamp}@rotacultural.com`
}

/**
 * Gera um username único para testes
 */
export const generateUniqueUsername = (): string => {
  const timestamp = Date.now()
  return `usuario_${timestamp}`
}

/**
 * Gera dados de usuário para testes
 */
export const generateUserData = () => {
  const timestamp = Date.now()
  return {
    name: `Usuário Teste ${timestamp}`,
    username: `usuario_${timestamp}`,
    email: `teste_${timestamp}@rotacultural.com`,
    password: 'Senha@123',
  }
}

/**
 * Gera dados de lugar para testes
 */
export const generatePlaceData = () => {
  const timestamp = Date.now()
  return {
    name: `Lugar Teste ${timestamp}`,
    description: 'Descrição do lugar de teste criado automaticamente',
    address: 'Rua Teste, 123, Patos - PB',
    latitude: -7.0245 + (Math.random() * 0.01),
    longitude: -37.2803 + (Math.random() * 0.01),
    category: 'Praça',
  }
}

/**
 * Gera dados de evento para testes
 */
export const generateEventData = () => {
  const timestamp = Date.now()
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + 30)
  
  return {
    name: `Evento Teste ${timestamp}`,
    description: 'Descrição do evento de teste criado automaticamente',
    address: 'Praça Central, Patos - PB',
    latitude: -7.0245,
    longitude: -37.2803,
    category: 'Música',
    start_date: futureDate.toISOString(),
    end_date: new Date(futureDate.getTime() + 3600000).toISOString(), // +1 hora
  }
}

/**
 * Aguarda elemento estar visível e pronto para interação
 */
export const waitForElement = (selector: string, timeout = 10000) => {
  return cy.get(selector, { timeout }).should('be.visible').and('not.be.disabled')
}

/**
 * Preenche formulário de forma genérica
 */
export const fillForm = (formData: Record<string, string>) => {
  Object.entries(formData).forEach(([name, value]) => {
    cy.get(`input[name="${name}"], textarea[name="${name}"]`).type(value)
  })
}

/**
 * Verifica se está em modo mobile
 */
export const isMobile = () => {
  return cy.window().then((win) => win.innerWidth < 768)
}

/**
 * Scroll até elemento
 */
export const scrollToElement = (selector: string) => {
  return cy.get(selector).scrollIntoView()
}

/**
 * Aguarda loading desaparecer
 */
export const waitForLoading = () => {
  cy.get('[class*="loading"], [class*="spinner"]', { timeout: 1000 }).should('not.exist')
}

/**
 * Verifica se elemento existe sem falhar o teste
 */
export const elementExists = (selector: string): Cypress.Chainable<boolean> => {
  return cy.get('body').then(($body) => {
    return $body.find(selector).length > 0
  })
}

/**
 * Clica em elemento se ele existir
 */
export const clickIfExists = (selector: string) => {
  cy.get('body').then(($body) => {
    if ($body.find(selector).length > 0) {
      cy.get(selector).click()
    }
  })
}

/**
 * Limpa localStorage e sessionStorage
 */
export const clearStorage = () => {
  cy.window().then((win) => {
    win.localStorage.clear()
    win.sessionStorage.clear()
  })
}

/**
 * Simula delay de rede
 */
export const simulateNetworkDelay = (ms: number) => {
  cy.intercept('**/*', (req) => {
    req.reply((res) => {
      res.delay(ms)
    })
  })
}

/**
 * Verifica se está autenticado
 */
export const isAuthenticated = (): Cypress.Chainable<boolean> => {
  return cy.window().then((win) => {
    return !!win.localStorage.getItem('token')
  })
}

/**
 * Aguarda navegação completar
 */
export const waitForNavigation = (expectedUrl: string) => {
  cy.url().should('include', expectedUrl, { timeout: 10000 })
}

/**
 * Tira screenshot com nome customizado
 */
export const takeScreenshot = (name: string) => {
  const timestamp = Date.now()
  cy.screenshot(`${name}-${timestamp}`)
}

/**
 * Verifica se API está respondendo
 */
export const checkAPIHealth = () => {
  const apiUrl = Cypress.env('API_URL')
  return cy.request({
    url: `${apiUrl}/api/`,
    failOnStatusCode: false,
  }).then((response) => {
    return response.status === 200
  })
}

/**
 * Formata data para input date
 */
export const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

/**
 * Formata datetime para input datetime-local
 */
export const formatDateTimeForInput = (date: Date): string => {
  return date.toISOString().slice(0, 16)
}

/**
 * Aguarda múltiplas requisições
 */
export const waitForMultipleRequests = (aliases: string[]) => {
  aliases.forEach((alias) => {
    cy.wait(alias)
  })
}

/**
 * Verifica se elemento está no viewport
 */
export const isInViewport = (selector: string): Cypress.Chainable<boolean> => {
  return cy.get(selector).then(($el) => {
    const rect = $el[0].getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= Cypress.config('viewportHeight') &&
      rect.right <= Cypress.config('viewportWidth')
    )
  })
}

/**
 * Aguarda animação completar
 */
export const waitForAnimation = (selector: string) => {
  cy.get(selector).should('not.have.class', 'animating')
    .and('not.have.class', 'transitioning')
}

/**
 * Verifica se modal está aberto
 */
export const isModalOpen = (): Cypress.Chainable<boolean> => {
  return cy.get('body').then(($body) => {
    return $body.find('[role="dialog"], [class*="modal"]').length > 0
  })
}

/**
 * Fecha modal se estiver aberto
 */
export const closeModalIfOpen = () => {
  cy.get('body').then(($body) => {
    if ($body.find('[role="dialog"], [class*="modal"]').length > 0) {
      cy.get('[aria-label*="close"], [class*="close"]').first().click()
    }
  })
}

/**
 * Seleciona opção de select por texto
 */
export const selectByText = (selector: string, text: string) => {
  cy.get(selector).select(text)
}

/**
 * Verifica se toast/notification apareceu
 */
export const waitForToast = (message?: string) => {
  if (message) {
    cy.contains('[role="alert"], [class*="toast"], [class*="notification"]', message, { timeout: 5000 })
  } else {
    cy.get('[role="alert"], [class*="toast"], [class*="notification"]', { timeout: 5000 }).should('be.visible')
  }
}

/**
 * Drag and drop
 */
export const dragAndDrop = (sourceSelector: string, targetSelector: string) => {
  cy.get(sourceSelector).trigger('dragstart')
  cy.get(targetSelector).trigger('drop')
}

/**
 * Verifica se página está carregada
 */
export const waitForPageLoad = () => {
  cy.window().its('document.readyState').should('equal', 'complete')
}

/**
 * Obtém coordenadas de Patos-PB
 */
export const getPatosCoordinates = () => {
  return {
    latitude: -7.0245,
    longitude: -37.2803,
  }
}

/**
 * Simula geolocalização
 */
export const mockGeolocation = (latitude: number, longitude: number) => {
  cy.window().then((win) => {
    cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((callback) => {
      return callback({ coords: { latitude, longitude } })
    })
  })
}
