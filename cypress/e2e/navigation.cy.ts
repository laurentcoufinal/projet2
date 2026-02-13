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

  it('should redirect to login when clicking "Liste des étudiants" without authentication', () => {
    cy.contains('a', 'Liste des étudiants').click();
    cy.url().should('include', '/login');
  });

  it('should navigate to students list when clicking "Liste des étudiants" when authenticated', () => {
    cy.intercept('GET', '/api/read/students', { statusCode: 200, body: [] }).as('students');
    cy.login();
    cy.visit('/');
    cy.contains('a', 'Liste des étudiants').click();
    cy.url().should('include', '/students');
    cy.wait('@students');
  });

  it('should navigate to update list when clicking "Modifier un étudiant" when authenticated', () => {
    cy.intercept('GET', '/api/read/students', { statusCode: 200, body: [] }).as('students');
    cy.login();
    cy.visit('/');
    cy.contains('a', 'Modifier un étudiant').click();
    cy.url().should('include', '/students/update');
    cy.wait('@students');
  });

  it('should navigate to delete list when clicking "Supprimer un étudiant" when authenticated', () => {
    cy.intercept('GET', '/api/read/students', { statusCode: 200, body: [] }).as('students');
    cy.login();
    cy.visit('/');
    cy.contains('a', 'Supprimer un étudiant').click();
    cy.url().should('include', '/students/delete');
    cy.wait('@students');
  });

  it('should show students list with "Modifier" links on students/update page', () => {
    cy.intercept('GET', '/api/read/students', {
      statusCode: 200,
      body: [{ id: 1, login: 'john', firstName: 'John', lastName: 'Doe', created_at: '', updated_at: '' }],
    }).as('students');
    cy.login();
    cy.visit('/students/update');
    cy.wait('@students');
    cy.get('table').should('be.visible');
    cy.contains('a', 'Modifier').should('be.visible');
  });

  it('should show students list with "Supprimer" links on students/delete page', () => {
    cy.intercept('GET', '/api/read/students', {
      statusCode: 200,
      body: [{ id: 1, login: 'john', firstName: 'John', lastName: 'Doe', created_at: '', updated_at: '' }],
    }).as('students');
    cy.login();
    cy.visit('/students/delete');
    cy.wait('@students');
    cy.get('table').should('be.visible');
    cy.contains('a', 'Supprimer').should('be.visible');
  });
});
