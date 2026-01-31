import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get_all_users should map API response to Student[]', (done) => {
    const apiResponse = [
      { id: 1, login: 'john', firstName: 'John', lastName: 'Doe', created_at: '2026-01-01T10:00:00', updated_at: '2026-01-02T11:00:00' },
    ];
    service.get_all_users().subscribe((students) => {
      expect(students.length).toBe(1);
      expect(students[0].login).toBe('john');
      expect(students[0].firstname).toBe('John');
      expect(students[0].lastname).toBe('Doe');
      expect(students[0].datecreation).toBe('2026-01-01T10:00:00');
      expect(students[0].datemiseajour).toBe('2026-01-02T11:00:00');
      done();
    });
    const req = httpMock.expectOne('/api/read/students');
    expect(req.request.method).toBe('GET');
    req.flush(apiResponse);
  });

  it('login should extract token from plain text response', (done) => {
    const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
    service.login({ login: 'user', password: 'pass' }).subscribe((res) => {
      expect(res.token).toBe(jwtToken);
      done();
    });
    const req = httpMock.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    req.flush(jwtToken, { status: 200, statusText: 'OK', headers: {} });
  });

  it('login should extract token from JSON response', (done) => {
    const body = JSON.stringify({ token: 'json-token-123' });
    service.login({ login: 'user', password: 'pass' }).subscribe((res) => {
      expect(res.token).toBe('json-token-123');
      done();
    });
    const req = httpMock.expectOne('/api/login');
    req.flush(body, { status: 200, statusText: 'OK', headers: {} });
  });

  it('delete_user should call DELETE with login', (done) => {
    service.delete_user('john').subscribe(() => done());
    const req = httpMock.expectOne('/api/delete/student/john');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
