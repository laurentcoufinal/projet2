import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule, RouterTestingModule],
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
});
