import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { DeleteComponent } from './delete.component';
import { UserService } from '../../core/service/user.service';

describe('DeleteComponent', () => {
  let component: DeleteComponent;
  let fixture: ComponentFixture<DeleteComponent>;
  let router: Router;
  let userService: { get_user: jest.Mock; delete_user: jest.Mock };
  let navigateSpy: jest.Mock;
  let routeLogin: string | null = 'test-login';

  beforeEach(async () => {
    userService = {
      get_user: jest.fn().mockReturnValue(
        of({
          login: 'test-login',
          firstname: 'Jean',
          lastname: 'Dupont',
          datecreation: '',
          datemiseajour: '',
        })
      ),
      delete_user: jest.fn().mockReturnValue(of({})),
    };
    routeLogin = 'test-login';

    await TestBed.configureTestingModule({
      imports: [DeleteComponent, RouterTestingModule.withRoutes([])],
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

    fixture = TestBed.createComponent(DeleteComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    navigateSpy = jest.spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set error when login param is missing', () => {
    routeLogin = null;
    const f = TestBed.createComponent(DeleteComponent);
    f.detectChanges();
    expect(f.componentInstance.error).toBe('Login manquant.');
    expect(f.componentInstance.loading).toBe(false);
  });

  it('should set error when get_user returns 404', () => {
    routeLogin = 'x';
    userService.get_user.mockReturnValue(throwError(() => ({ status: 404 })));
    const f = TestBed.createComponent(DeleteComponent);
    f.detectChanges();
    expect(f.componentInstance.error).toBe('Étudiant introuvable.');
    expect(f.componentInstance.loading).toBe(false);
  });

  it('should set error when get_user returns other error', () => {
    routeLogin = 'x';
    userService.get_user.mockReturnValue(throwError(() => ({ status: 500, message: 'Server error' })));
    const f = TestBed.createComponent(DeleteComponent);
    f.detectChanges();
    expect(f.componentInstance.error).toBe('Server error');
  });

  it('confirmDelete should call delete_user and navigate to students', () => {
    component.confirmDelete();
    expect(userService.delete_user).toHaveBeenCalledWith('test-login');
    expect(navigateSpy).toHaveBeenCalledWith(['/students']);
  });

  it('confirmDelete should set error on delete failure', () => {
    userService.delete_user.mockReturnValue(throwError(() => ({ message: 'Delete failed' })));
    component.confirmDelete();
    expect(component.error).toBe('Delete failed');
    expect(component.deleting).toBe(false);
  });

  it('confirmDelete should do nothing when login is null', () => {
    component.login = null;
    component.confirmDelete();
    expect(userService.delete_user).not.toHaveBeenCalled();
  });
});
