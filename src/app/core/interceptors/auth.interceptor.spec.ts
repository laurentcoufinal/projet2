import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../service/auth.service';

describe('authInterceptor', () => {
  it('should add Authorization Bearer header when token exists', (done) => {
    const authService = { getToken: () => 'jwt-123' };
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authService }],
    });
    const req = new HttpRequest('GET', '/api/test');
    let receivedReq: HttpRequest<unknown> | null = null;
    const next: HttpHandlerFn = (r) => {
      receivedReq = r;
      return of({ body: null } as any);
    };
    TestBed.runInInjectionContext(() => {
      authInterceptor(req, next).subscribe(() => {
        expect(receivedReq).not.toBeNull();
        expect(receivedReq!.headers.get('Authorization')).toBe('Bearer jwt-123');
        done();
      });
    });
  });

  it('should pass request without Authorization when no token', (done) => {
    const authService = { getToken: () => null };
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authService }],
    });
    const req = new HttpRequest('GET', '/api/test');
    let receivedReq: HttpRequest<unknown> | null = null;
    const next: HttpHandlerFn = (r) => {
      receivedReq = r;
      return of({ body: null } as any);
    };
    TestBed.runInInjectionContext(() => {
      authInterceptor(req, next).subscribe(() => {
        expect(receivedReq).toBe(req);
        expect(receivedReq!.headers.has('Authorization')).toBe(false);
        done();
      });
    });
  });
});
