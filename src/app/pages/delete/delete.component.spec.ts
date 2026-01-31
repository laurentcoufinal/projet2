import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DeleteComponent } from './delete.component';
import { UserService } from '../../core/service/user.service';

describe('DeleteComponent', () => {
  let component: DeleteComponent;
  let fixture: ComponentFixture<DeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => 'test-login' } },
          },
        },
        {
          provide: UserService,
          useValue: {
            get_user: () =>
              of({
                login: 'test-login',
                firstname: 'Jean',
                lastname: 'Dupont',
                datecreation: '',
                datemiseajour: '',
              }),
            delete_user: () => of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
