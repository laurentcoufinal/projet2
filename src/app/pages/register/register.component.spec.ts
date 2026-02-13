import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RegisterComponent } from './register.component';
import { UserService } from '../../core/service/user.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: { register: jest.Mock };
  let router: { navigate: jest.Mock };

  beforeEach(async () => {
    userService = { register: jest.fn().mockReturnValue(of({})) };
    router = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onSubmit should not call register when form is invalid', () => {
    component.registerForm.patchValue({ firstName: '', lastName: '', login: '', password: '' });
    component.onSubmit();
    expect(userService.register).not.toHaveBeenCalled();
  });

  it('onSubmit should call register and navigate on success', () => {
    component.registerForm.patchValue({
      firstName: 'A',
      lastName: 'B',
      login: 'ab',
      password: 'p',
    });
    component.onSubmit();
    expect(userService.register).toHaveBeenCalledWith({
      firstName: 'A',
      lastName: 'B',
      login: 'ab',
      password: 'p',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/'], { replaceUrl: true });
  });

  it('onReset should reset form and submitted', () => {
    component.submitted = true;
    component.registerForm.patchValue({ firstName: 'A', lastName: 'B', login: 'l', password: 'p' });
    component.onReset();
    expect(component.submitted).toBe(false);
    expect(component.registerForm.get('firstName')?.value).toBe(null);
  });
});
