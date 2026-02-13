describe('Students pages', () => {
  it('should redirect to login when accessing /students without authentication', () => {
    cy.visit('/students');
    cy.url().should('include', '/login');
  });

  it('should redirect to login when accessing /students/update without authentication', () => {
    cy.visit('/students/update');
    cy.url().should('include', '/login');
  });

  it('should redirect to login when accessing /students/delete without authentication', () => {
    cy.visit('/students/delete');
    cy.url().should('include', '/login');
  });

  it('should display students list when authenticated', () => {
    cy.intercept('GET', '/api/read/students', {
      statusCode: 200,
      body: [
        {
          id: 1,
          login: 'john',
          firstName: 'John',
          lastName: 'Doe',
          created_at: '2026-01-01T10:00:00',
          updated_at: '2026-01-02T11:00:00',
        },
      ],
    }).as('getStudents');

    cy.login();
    cy.visit('/students');
    cy.wait('@getStudents');
    cy.get('table').should('be.visible');
    cy.contains('john').should('be.visible');
    cy.contains('John').should('be.visible');
    cy.contains('Doe').should('be.visible');
  });

  it('should display empty message when no students', () => {
    cy.intercept('GET', '/api/read/students', {
      statusCode: 200,
      body: [],
    }).as('getStudents');

    cy.login();
    cy.visit('/students');
    cy.wait('@getStudents');
    cy.contains('Aucun étudiant pour le moment').should('be.visible');
  });

  it('should show loading then list when GET students has delay', () => {
    cy.intercept('GET', '/api/read/students', (req) => {
      req.reply({
        delay: 300,
        statusCode: 200,
        body: [{ id: 1, login: 'john', firstName: 'John', lastName: 'Doe', created_at: '', updated_at: '' }],
      });
    }).as('getStudents');

    cy.login();
    cy.visit('/students');
    cy.contains('Chargement des étudiants').should('be.visible');
    cy.wait('@getStudents');
    cy.get('table').should('be.visible');
    cy.contains('john').should('be.visible');
  });

  it('should display error when GET students returns 500', () => {
    cy.intercept('GET', '/api/read/students', {
      statusCode: 500,
      body: { message: 'Server Error' },
    }).as('getStudents');

    cy.login();
    cy.visit('/students');
    cy.wait('@getStudents');
    cy.get('.error').should('be.visible');
    cy.get('.error').should('be.visible');
  });

  it('should redirect to login when GET students returns 401', () => {
    cy.intercept('GET', '/api/read/students', { statusCode: 401, body: {} }).as('getStudents');

    cy.login();
    cy.visit('/students');
    cy.wait('@getStudents');
    cy.url().should('include', '/login');
  });

  it('should navigate to home when clicking "Retour à l\'accueil"', () => {
    cy.intercept('GET', '/api/read/students', { statusCode: 200, body: [] }).as('getStudents');

    cy.login();
    cy.visit('/students');
    cy.wait('@getStudents');
    cy.contains('a', 'Retour à l\'accueil').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
