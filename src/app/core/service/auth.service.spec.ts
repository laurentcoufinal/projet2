import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const TOKEN_KEY = 'auth_token';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorage.removeItem(TOKEN_KEY);
  });

  afterEach(() => {
    localStorage.removeItem(TOKEN_KEY);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false when no token', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getToken()).toBeNull();
    expect(service.getAuthHeader()).toBeNull();
  });

  it('should store and return token', () => {
    const token = 'jwt-token-123';
    service.setToken(token);
    expect(service.getToken()).toBe(token);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.getAuthHeader()).toBe('Bearer jwt-token-123');
  });

  it('should remove token on logout', () => {
    service.setToken('some-token');
    expect(service.isAuthenticated()).toBe(true);
    service.logout();
    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getAuthHeader()).toBeNull();
  });
});
