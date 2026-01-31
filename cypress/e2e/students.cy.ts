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
});
