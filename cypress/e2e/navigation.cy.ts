describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the home page with navigation', () => {
    cy.get('.nav').should('be.visible');
    cy.contains('a', 'Accueil').should('be.visible');
    cy.contains('a', 'Connexion').should('be.visible');
    cy.contains('a', 'Inscription').should('be.visible');
    cy.contains('a', 'Liste des étudiants').should('be.visible');
  });

  it('should display welcome content on home page', () => {
    cy.get('h1').should('contain', 'Bienvenue');
    cy.contains('Voir la liste des étudiants').should('be.visible');
  });

  it('should navigate to login page when clicking Connexion', () => {
    cy.contains('a', 'Connexion').click();
    cy.url().should('include', '/login');
    cy.get('h5').should('contain', 'Login');
  });

  it('should navigate to register page when clicking Inscription', () => {
    cy.contains('a', 'Inscription').click();
    cy.url().should('include', '/register');
    cy.get('h5').should('contain', 'Registration Form');
  });

  it('should redirect to login when accessing students without auth', () => {
    cy.visit('/students');
    cy.url().should('include', '/login');
  });

  it('should navigate back to home from login', () => {
    cy.visit('/login');
    cy.contains('a', 'Accueil').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
