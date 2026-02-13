describe('Page d\'accueil', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display home page with title and description', () => {
    cy.get('h1').should('contain', 'Bienvenue');
    cy.contains('Page d\'accueil de l\'application').should('be.visible');
  });

  it('should display link to students list', () => {
    cy.contains('a', 'Voir la liste des étudiants').should('be.visible');
    cy.contains('a', 'Voir la liste des étudiants').should('have.attr', 'href').and('include', '/students');
  });

  it('should redirect to login when clicking "Voir la liste des étudiants" without authentication', () => {
    cy.contains('a', 'Voir la liste des étudiants').click();
    cy.url().should('include', '/login');
  });

  it('should navigate to students list when clicking "Voir la liste des étudiants" when authenticated', () => {
    cy.intercept('POST', '/api/login', { statusCode: 200, body: 'mock-token' }).as('login');
    cy.intercept('GET', '/api/read/students', { statusCode: 200, body: [] }).as('students');
    cy.login();
    cy.visit('/');
    cy.contains('a', 'Voir la liste des étudiants').click();
    cy.url().should('include', '/students');
    cy.wait('@students');
    cy.contains('Aucun étudiant pour le moment').should('be.visible');
  });
});
