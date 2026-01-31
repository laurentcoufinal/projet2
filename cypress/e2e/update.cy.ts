describe('Page Modifier un étudiant', () => {
  it('should redirect to login when accessing /students/update/john without authentication', () => {
    cy.visit('/students/update/john');
    cy.url().should('include', '/login');
  });

  it('should display update form when authenticated', () => {
    cy.intercept('GET', '/api/read/student/john', {
      statusCode: 200,
      body: {
        login: 'john',
        firstName: 'John',
        lastName: 'Doe',
        firstname: 'John',
        lastname: 'Doe',
      },
    }).as('getStudent');

    cy.login();
    cy.visit('/students/update/john');
    cy.wait('@getStudent');

    cy.get('h2').should('contain', 'Modifier l\'étudiant john');
    cy.get('input#login').should('have.value', 'john');
    cy.get('input#firstname').should('have.value', 'John');
    cy.get('input#lastname').should('have.value', 'Doe');
    cy.get('button[type="submit"]').should('contain', 'Enregistrer');
    cy.contains('a', 'Annuler').should('be.visible');
  });

  it('should show validation errors when submitting empty firstname/lastname', () => {
    cy.intercept('GET', '/api/read/student/john', {
      statusCode: 200,
      body: {
        login: 'john',
        firstname: 'John',
        lastname: 'Doe',
      },
    }).as('getStudent');

    cy.login();
    cy.visit('/students/update/john');
    cy.wait('@getStudent');

    cy.get('input#firstname').clear();
    cy.get('input#lastname').clear();
    cy.get('button[type="submit"]').click();

    cy.contains('Le prénom est requis.').should('be.visible');
    cy.contains('Le nom est requis.').should('be.visible');
  });

  it('should redirect to students list after successful update', () => {
    cy.intercept('GET', '/api/read/student/john', {
      statusCode: 200,
      body: {
        login: 'john',
        firstname: 'John',
        lastname: 'Doe',
      },
    }).as('getStudent');
    cy.intercept('PUT', '/api/update/student/john', {
      statusCode: 200,
      body: { login: 'john', firstname: 'Jean', lastname: 'Dupont' },
    }).as('updateStudent');
    cy.intercept('GET', '/api/read/students', {
      statusCode: 200,
      body: [],
    }).as('getStudents');

    cy.login();
    cy.visit('/students/update/john');
    cy.wait('@getStudent');

    cy.get('input#firstname').clear().type('Jean');
    cy.get('input#lastname').clear().type('Dupont');
    cy.get('button[type="submit"]').click();

    cy.wait('@updateStudent');
    cy.url().should('include', '/students');
  });

  it('should navigate from students/update list to update form and back', () => {
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
    cy.visit('/students/update');
    cy.wait('@getStudents');
    cy.get('table').within(() => cy.contains('a', 'Modifier').first().click());
    cy.url().should('include', '/students/update/jane');
    cy.wait('@getStudent');
    cy.get('h2').should('contain', 'jane');
    cy.contains('a', 'Annuler').click();
    cy.url().should('include', '/students');
  });
});
