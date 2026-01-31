/// <reference types="cypress" />

/**
 * Connexion via le formulaire login avec mocks API.
 * Stub POST /api/login (200 + token) puis visite /login, remplit le formulaire et soumet.
 */
Cypress.Commands.add('login', (username = 'user', password = 'pass') => {
  cy.intercept('POST', '/api/login', {
    statusCode: 200,
    body: 'mock-jwt-token',
  }).as('login');
  cy.visit('/login');
  cy.get('input#login').type(username);
  cy.get('input#password').type(password);
  cy.get('button[type="submit"]').click();
  cy.wait('@login');
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(username?: string, password?: string): Chainable<void>;
    }
  }
}

export {};
