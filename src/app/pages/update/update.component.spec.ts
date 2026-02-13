import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { UpdateComponent } from './update.component';
import { UserService } from '../../core/service/user.service';

describe('UpdateComponent', () => {
  let component: UpdateComponent;
  let fixture: ComponentFixture<UpdateComponent>;
  let userService: { get_user: jest.Mock; update_user: jest.Mock };
  let navigateSpy: jest.Mock;
  let routeLogin: string | null = 'test-login';

  beforeEach(async () => {
    userService = {
      get_user: jest.fn().mockReturnValue(of({
        login: 'test-login',
        firstname: 'Jean',
        lastname: 'Dupont',
        datecreation: '',
        datemiseajour: '',
      })),
      update_user: jest.fn().mockReturnValue(of({} as any)),
    };
    routeLogin = 'test-login';

    await TestBed.configureTestingModule({
      imports: [UpdateComponent, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => routeLogin } },
          },
        },
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateComponent);
    component = fixture.componentInstance;
    navigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set error when login param is missing', () => {
    routeLogin = null;
    const f = TestBed.createComponent(UpdateComponent);
    f.detectChanges();
    expect(f.componentInstance.error).toBe('Login manquant.');
    expect(f.componentInstance.loading).toBe(false);
  });

  it('should set error when get_user returns 404', () => {
    routeLogin = 'x';
    userService.get_user.mockReturnValue(throwError(() => ({ status: 404 })));
    const f = TestBed.createComponent(UpdateComponent);
    f.detectChanges();
    expect(f.componentInstance.error).toBe('Étudiant introuvable.');
  });

  it('should set error when get_user returns other error', () => {
    routeLogin = 'x';
    userService.get_user.mockReturnValue(throwError(() => ({ message: 'Server error' })));
    const f = TestBed.createComponent(UpdateComponent);
    f.detectChanges();
    expect(f.componentInstance.error).toBe('Server error');
  });

  it('onSubmit should call update_user and navigate on success', () => {
    component.updateForm.patchValue({ firstname: 'Jean', lastname: 'Dupont' });
    component.onSubmit();
    expect(userService.update_user).toHaveBeenCalledWith('test-login', { firstName: 'Jean', lastName: 'Dupont' });
    expect(navigateSpy).toHaveBeenCalledWith(['/students']);
  });

  it('onSubmit should set error on update failure', () => {
    userService.update_user.mockReturnValue(throwError(() => ({ message: 'Update failed' })));
    component.updateForm.patchValue({ firstname: 'Jean', lastname: 'Dupont' });
    component.onSubmit();
    expect(component.error).toBe('Update failed');
    expect(component.saving).toBe(false);
  });

  it('onSubmit should do nothing when form invalid', () => {
    component.updateForm.patchValue({ firstname: '', lastname: '' });
    component.onSubmit();
    expect(userService.update_user).not.toHaveBeenCalled();
  });

  it('onSubmit should do nothing when login is null', () => {
    component.login = null;
    component.updateForm.patchValue({ firstname: 'A', lastname: 'B' });
    component.onSubmit();
    expect(userService.update_user).not.toHaveBeenCalled();
  });
});
