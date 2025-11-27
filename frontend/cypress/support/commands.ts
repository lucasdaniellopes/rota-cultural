/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login
       * @example cy.login('user@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>
      
      /**
       * Custom command to logout
       * @example cy.logout()
       */
      logout(): Chainable<void>
      
      /**
       * Custom command to create a place
       * @example cy.createPlace({ name: 'Test Place', ... })
       */
      createPlace(placeData: any): Chainable<void>
      
      /**
       * Custom command to create an event
       * @example cy.createEvent({ name: 'Test Event', ... })
       */
      createEvent(eventData: any): Chainable<void>
      
      /**
       * Custom command to add item to favorites
       * @example cy.addToFavorites(1, 'place')
       */
      addToFavorites(itemId: number, itemType: 'place' | 'event'): Chainable<void>
      
      /**
       * Custom command to submit a review
       * @example cy.submitReview(1, 'place', { rating: 5, comment: 'Great!' })
       */
      submitReview(itemId: number, itemType: 'place' | 'event', reviewData: any): Chainable<void>
      
      /**
       * Custom command to intercept API calls
       * @example cy.interceptAPI('GET', '/api/places/', 'places')
       */
      interceptAPI(method: string, endpoint: string, fixture?: string): Chainable<void>
    }
  }
}

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/entrar')
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.get('button[type="submit"]').click()
    
    // Wait for redirect or token storage
    cy.url().should('not.include', '/entrar', { timeout: 5000 })
    cy.window().its('localStorage').invoke('getItem', 'access_token').should('exist')
  })
})

// Logout command
Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('access_token')
    win.localStorage.removeItem('refresh_token')
  })
  cy.visit('/')
})

// Create place command
Cypress.Commands.add('createPlace', (placeData) => {
  const apiUrl = Cypress.env('API_URL')
  
  cy.window().then((win) => {
    const token = win.localStorage.getItem('access_token')
    
    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/places/`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: placeData,
    })
  })
})

// Create event command
Cypress.Commands.add('createEvent', (eventData) => {
  const apiUrl = Cypress.env('API_URL')
  
  cy.window().then((win) => {
    const token = win.localStorage.getItem('access_token')
    
    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/events/`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: eventData,
    })
  })
})

// Add to favorites command
Cypress.Commands.add('addToFavorites', (itemId, itemType) => {
  const apiUrl = Cypress.env('API_URL')
  
  cy.window().then((win) => {
    const token = win.localStorage.getItem('access_token')
    
    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/favorites/`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: {
        item_id: itemId,
        item_type: itemType,
      },
    })
  })
})

// Submit review command
Cypress.Commands.add('submitReview', (itemId, itemType, reviewData) => {
  const apiUrl = Cypress.env('API_URL')
  
  cy.window().then((win) => {
    const token = win.localStorage.getItem('access_token')
    
    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/reviews/`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: {
        item_id: itemId,
        item_type: itemType,
        ...reviewData,
      },
    })
  })
})

// Intercept API command
Cypress.Commands.add('interceptAPI', (method, endpoint, fixture) => {
  const apiUrl = Cypress.env('API_URL')
  
  if (fixture) {
    cy.intercept(method, `${apiUrl}${endpoint}`, { fixture })
  } else {
    cy.intercept(method, `${apiUrl}${endpoint}`)
  }
})

export {}
