describe('Page Supprimer un étudiant', () => {
  it('should redirect to login when accessing /students/delete/john without authentication', () => {
    cy.visit('/students/delete/john');
    cy.url().should('include', '/login');
  });

  it('should display delete confirmation with student info when authenticated', () => {
    cy.intercept('GET', '/api/read/student/john', {
      statusCode: 200,
      body: {
        login: 'john',
        firstname: 'John',
        lastname: 'Doe',
      },
    }).as('getStudent');

    cy.login();
    cy.visit('/students/delete/john');
    cy.wait('@getStudent');

    cy.get('h2').should('contain', 'Supprimer l\'étudiant');
    cy.contains('Êtes-vous sûr de vouloir supprimer l\'étudiant suivant ?').should('be.visible');
    cy.get('dl.student-info').within(() => {
      cy.contains('Login').should('be.visible');
      cy.contains('john').should('be.visible');
      cy.contains('Prénom').should('be.visible');
      cy.contains('John').should('be.visible');
      cy.contains('Nom').should('be.visible');
      cy.contains('Doe').should('be.visible');
    });
    cy.get('button.btn-danger').should('contain', 'Confirmer la suppression');
    cy.contains('a', 'Annuler').should('be.visible');
  });

  it('should redirect to students list after confirming delete', () => {
    cy.intercept('GET', '/api/read/student/john', {
      statusCode: 200,
      body: {
        login: 'john',
        firstname: 'John',
        lastname: 'Doe',
      },
    }).as('getStudent');
    cy.intercept('DELETE', '/api/delete/student/john', {
      statusCode: 200,
      body: {},
    }).as('deleteStudent');
    cy.intercept('GET', '/api/read/students', {
      statusCode: 200,
      body: [],
    }).as('getStudents');

    cy.login();
    cy.visit('/students/delete/john');
    cy.wait('@getStudent');

    cy.get('button.btn-danger').click();
    cy.wait('@deleteStudent');
    cy.url().should('include', '/students');
  });

  it('should navigate from students/delete list to delete page and back', () => {
    cy.intercept('GET', '/api/read/students', {
      statusCode: 200,
      body: [
        {
          id: 1,
          login: 'jane',
          firstName: 'Jane',
          lastName: 'Doe',
          created_at: '2026-01-01T10:00:00',
          updated_at: '2026-01-02T11:00:00',
        },
      ],
    }).as('getStudents');
    cy.intercept('GET', '/api/read/student/jane', {
      statusCode: 200,
      body: { login: 'jane', firstname: 'Jane', lastname: 'Doe' },
    }).as('getStudent');

    cy.login();
    cy.visit('/students/delete');
    cy.wait('@getStudents');
    cy.get('table').within(() => cy.contains('a', 'Supprimer').first().click());
    cy.url().should('include', '/students/delete/jane');
    cy.wait('@getStudent');
    cy.get('dl.student-info').should('contain', 'jane');
    cy.contains('a', 'Annuler').click();
    cy.url().should('include', '/students');
  });
});
