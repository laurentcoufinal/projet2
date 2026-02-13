import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { UserService } from '../../core/service/user.service';
import { AuthService } from '../../core/service/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userService: { login: jest.Mock };
  let authService: { setToken: jest.Mock };
  let router: { navigate: jest.Mock };

  beforeEach(async () => {
    userService = { login: jest.fn().mockReturnValue(of({ token: 'test-token' })) };
    authService = { setToken: jest.fn() };
    router = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a login form with login and password controls', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('login')).toBeTruthy();
    expect(component.loginForm.get('password')).toBeTruthy();
  });

  it('should be invalid when fields are empty', () => {
    component.loginForm.patchValue({ login: '', password: '' });
    expect(component.loginForm.valid).toBe(false);
  });

  it('should be valid when fields are filled', () => {
    component.loginForm.patchValue({ login: 'user', password: 'pass' });
    expect(component.loginForm.valid).toBe(true);
  });

  it('onSubmit should not call login when form is invalid', () => {
    component.loginForm.patchValue({ login: '', password: '' });
    component.onSubmit();
    expect(userService.login).not.toHaveBeenCalled();
  });

  it('onSubmit should call setToken and navigate on success', fakeAsync(() => {
    component.loginForm.patchValue({ login: 'u', password: 'p' });
    component.onSubmit();
    expect(userService.login).toHaveBeenCalledWith({ login: 'u', password: 'p' });
    expect(authService.setToken).toHaveBeenCalledWith('test-token');
    tick(0);
    expect(router.navigate).toHaveBeenCalledWith(['/'], { replaceUrl: true });
  }));

  it('onSubmit should set loginError when response has no token', () => {
    userService.login.mockReturnValue(of({ token: null as any }));
    component.loginForm.patchValue({ login: 'u', password: 'p' });
    component.onSubmit();
    expect(component.loginError).toBe('Erreur de login : réponse invalide.');
  });

  it('onSubmit should set loginError for 401', () => {
    userService.login.mockReturnValue(throwError(() => ({ status: 401 })));
    component.loginForm.patchValue({ login: 'u', password: 'p' });
    component.onSubmit();
    expect(component.loginError).toBe('Erreur de login : identifiants incorrects.');
  });

  it('onSubmit should set loginError for Token manquant message', () => {
    userService.login.mockReturnValue(throwError(() => ({ message: 'Token manquant dans la réponse du serveur' })));
    component.loginForm.patchValue({ login: 'u', password: 'p' });
    component.onSubmit();
    expect(component.loginError).toContain('le serveur n\'a pas renvoyé de token');
  });

  it('onSubmit should set loginError for other errors', () => {
    userService.login.mockReturnValue(throwError(() => ({ status: 500 })));
    component.loginForm.patchValue({ login: 'u', password: 'p' });
    component.onSubmit();
    expect(component.loginError).toBe('Erreur de login. Réessayez ou contactez l\'administrateur.');
  });

  it('onReset should reset form and flags', () => {
    component.submitted = true;
    component.loginError = 'err';
    component.loginForm.patchValue({ login: 'a', password: 'b' });
    component.onReset();
    expect(component.submitted).toBe(false);
    expect(component.loginError).toBeNull();
    expect(component.loginForm.get('login')?.value).toBe(null);
    expect(component.loginForm.get('password')?.value).toBe(null);
  });
});
