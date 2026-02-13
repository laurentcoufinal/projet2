/**
 * Mocks API partagés pour les tests e2e Cypress.
 * Utiliser avec cy.intercept() pour couvrir toutes les fonctionnalités sans backend.
 */

export const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token';

/** Réponse login succès (body texte) */
export const mockLoginSuccess = {
  statusCode: 200,
  body: MOCK_TOKEN,
};

/** Réponse login succès (body JSON avec token) */
export const mockLoginSuccessJson = {
  statusCode: 200,
  body: { token: MOCK_TOKEN },
};

/** Réponse login échec */
export const mockLogin401 = {
  statusCode: 401,
  body: {},
};

/** Liste d'étudiants vide */
export const mockStudentsEmpty = {
  statusCode: 200,
  body: [],
};

/** Liste d'étudiants avec un ou plusieurs étudiants */
export const mockStudentsList = [
  {
    id: 1,
    login: 'john',
    firstName: 'John',
    lastName: 'Doe',
    created_at: '2026-01-01T10:00:00',
    updated_at: '2026-01-02T11:00:00',
  },
  {
    id: 2,
    login: 'jane',
    firstName: 'Jane',
    lastName: 'Doe',
    created_at: '2026-01-01T10:00:00',
    updated_at: '2026-01-02T11:00:00',
  },
];

export const mockStudentsListResponse = {
  statusCode: 200,
  body: mockStudentsList,
};

/** Un étudiant (GET /api/read/student/:login) */
export const mockStudentJohn = {
  login: 'john',
  firstname: 'John',
  lastname: 'Doe',
  firstName: 'John',
  lastName: 'Doe',
};

export const mockStudentJane = {
  login: 'jane',
  firstname: 'Jane',
  lastname: 'Doe',
  firstName: 'Jane',
  lastName: 'Doe',
};

/** Inscription succès */
export const mockRegisterSuccess = {
  statusCode: 201,
  body: {},
};

/** Mise à jour étudiant succès */
export const mockUpdateSuccess = (login: string, firstname: string, lastname: string) => ({
  statusCode: 200,
  body: { login, firstname, lastname },
});

/** Suppression étudiant succès */
export const mockDeleteSuccess = {
  statusCode: 200,
  body: {},
};

/** Réponse erreur générique 500 */
export const mockError500 = {
  statusCode: 500,
  body: { message: 'Internal Server Error' },
};

/** Réponse 404 */
export const mockError404 = {
  statusCode: 404,
  body: {},
};
