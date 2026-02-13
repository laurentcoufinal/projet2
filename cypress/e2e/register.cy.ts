describe('Register page', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should display registration form with all fields', () => {
    cy.get('h5').should('contain', 'Registration Form');
    cy.get('input[formcontrolname="firstName"]').should('be.visible');
    cy.get('input[formcontrolname="lastName"]').should('be.visible');
    cy.get('input[formcontrolname="login"]').should('be.visible');
    cy.get('input[formcontrolname="password"]').should('be.visible');
    cy.contains('button', 'Register').should('be.visible');
  });

  it('should show validation errors when submitting empty form', () => {
    cy.contains('button', 'Register').click();
    cy.contains('First Name is required').should('be.visible');
    cy.contains('Last Name is required').should('be.visible');
    cy.contains('Login is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });

  it('should redirect to home after successful registration', () => {
    cy.intercept('POST', '/api/register', {
      statusCode: 201,
      body: {},
    }).as('register');

    cy.get('input[formcontrolname="firstName"]').type('Jean');
    cy.get('input[formcontrolname="lastName"]').type('Dupont');
    cy.get('input[formcontrolname="login"]').type('jdupont');
    cy.get('input[formcontrolname="password"]').type('secret123');
    cy.contains('button', 'Register').click();

    cy.wait('@register');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should show error when only first name is filled', () => {
    cy.get('input[formcontrolname="firstName"]').type('Jean');
    cy.contains('button', 'Register').click();
    cy.contains('Last Name is required').should('be.visible');
    cy.contains('Login is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });

  it('should reset form when clicking Cancel', () => {
    cy.get('input[formcontrolname="firstName"]').type('Jean');
    cy.get('input[formcontrolname="lastName"]').type('Dupont');
    cy.get('input[formcontrolname="login"]').type('jdupont');
    cy.get('input[formcontrolname="password"]').type('secret123');
    cy.contains('button', 'Cancel').click();
    cy.get('input[formcontrolname="firstName"]').should('have.value', '');
    cy.get('input[formcontrolname="lastName"]').should('have.value', '');
    cy.get('input[formcontrolname="login"]').should('have.value', '');
    cy.get('input[formcontrolname="password"]').should('have.value', '');
    cy.url().should('include', '/register');
  });
});
