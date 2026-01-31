import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { UpdateComponent } from './update.component';
import { UserService } from '../../core/service/user.service';

describe('UpdateComponent', () => {
  let component: UpdateComponent;
  let fixture: ComponentFixture<UpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateComponent],
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
            get_user: () => of({
              login: 'test-login',
              firstname: 'Jean',
              lastname: 'Dupont',
              datecreation: '',
              datemiseajour: '',
            }),
            update_user: () => of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
