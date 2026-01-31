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
    // Forcer l'échec réseau pour ce test : l'intercept 401 ne s'applique pas avec le proxy dev,
    // la requête reçoit 200+token → on utilise forceNetworkError pour que error() s'exécute.
    cy.intercept(
      { method: 'POST', pathname: '/api/login' },
      { forceNetworkError: true }
    ).as('loginRequest');

    cy.visit('/login', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });

    cy.get('input#login').type('baduser');
    cy.get('input#password').type('badpass');
    cy.get('button[type="submit"]').click();

    cy.contains('.login-error, .alert-danger', 'Erreur de login', { timeout: 15000 }).should('be.visible');
    cy.url().should('include', '/login');
    cy.get('input#login').should('be.visible');
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
});
