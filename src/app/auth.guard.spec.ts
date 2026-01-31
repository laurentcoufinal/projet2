import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './core/service/auth.service';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { isAuthenticated: () => false } },
        { provide: Router, useValue: { createUrlTree: (url: string[]) => ({} as UrlTree) } },
      ],
    });
  });

  it('should redirect to /login when not authenticated', () => {
    const router = TestBed.inject(Router);
    const createUrlTreeSpy = jest.spyOn(router, 'createUrlTree').mockReturnValue({} as UrlTree);
    executeGuard({} as any, {} as any);
    expect(createUrlTreeSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should allow access when authenticated', () => {
    const authService = TestBed.inject(AuthService);
    jest.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
    const result = executeGuard({} as any, {} as any);
    expect(result).toBe(true);
  });
});
