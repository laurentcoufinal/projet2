describe('Login page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form with login and password fields', () => {
    cy.get('h5').should('contain', 'Login');
    cy.get('input#login').should('be.visible');
    cy.get('input#password').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Login');
  });

  it('should show validation errors when submitting empty form', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Login is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });

  it('should show error when only login is filled', () => {
    cy.get('input#login').type('user');
    cy.get('button[type="submit"]').click();
    cy.contains('Password is required').should('be.visible');
  });

  it('should stay on login when API returns 401', () => {
    cy.intercept('POST', '/api/login', {
      statusCode: 401,
      body: {},
    }).as('loginRequest');

    cy.visit('/login', { onBeforeLoad: (win) => win.localStorage.clear() });
    cy.get('input#login').type('baduser');
    cy.get('input#password').type('badpass');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.contains('.login-error, .alert-danger', 'Erreur de login', { timeout: 5000 }).should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should show identifiants incorrects when API returns 401', () => {
    cy.intercept('POST', '/api/login', { statusCode: 401, body: {} }).as('login');
    cy.visit('/login', { onBeforeLoad: (win) => win.localStorage.clear() });
    cy.get('input#login').type('user');
    cy.get('input#password').type('wrong');
    cy.get('button[type="submit"]').click();
    cy.wait('@login');
    cy.contains('identifiants incorrects').should('be.visible');
  });

  it('should redirect to home after successful login when API returns token', () => {
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test-token',
    }).as('login');
    cy.intercept('GET', '/api/read/students', {
      statusCode: 200,
      body: [],
    }).as('students');

    cy.get('input#login').type('testuser');
    cy.get('input#password').type('testpass');
    cy.get('button[type="submit"]').click();

    cy.wait('@login');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should redirect to home when API returns token as JSON object', () => {
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.json-token' },
    }).as('login');
    cy.intercept('GET', '/api/read/students', { statusCode: 200, body: [] }).as('students');

    cy.get('input#login').type('user');
    cy.get('input#password').type('pass');
    cy.get('button[type="submit"]').click();

    cy.wait('@login');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should reset form and stay on login when clicking Cancel', () => {
    cy.get('input#login').type('something');
    cy.get('input#password').type('something');
    cy.contains('button', 'Cancel').click();
    cy.get('input#login').should('have.value', '');
    cy.get('input#password').should('have.value', '');
    cy.url().should('include', '/login');
  });
});
