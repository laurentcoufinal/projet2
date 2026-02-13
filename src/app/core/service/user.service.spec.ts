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

  it('login should extract token from object with nested data', (done) => {
    service.login({ login: 'u', password: 'p' }).subscribe((res) => {
      expect(res.token).toBe('nested-token');
      done();
    });
    const req = httpMock.expectOne('/api/login');
    req.flush({ data: { token: 'nested-token' } }, { status: 200, statusText: 'OK' });
  });

  it('login should extract token from object access_token key', (done) => {
    service.login({ login: 'u', password: 'p' }).subscribe((res) => {
      expect(res.token).toBe('access-token');
      done();
    });
    const req = httpMock.expectOne('/api/login');
    req.flush({ access_token: 'access-token' }, { status: 200, statusText: 'OK' });
  });

  it('delete_user should call DELETE with login', (done) => {
    service.delete_user('john').subscribe(() => done());
    const req = httpMock.expectOne('/api/delete/student/john');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('register should POST user to /api/register', (done) => {
    const user = { firstName: 'A', lastName: 'B', login: 'ab', password: 'p' };
    service.register(user as any).subscribe(() => done());
    const req = httpMock.expectOne('/api/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(user);
    req.flush({});
  });

  it('get_user_by_id should GET /api/read/student/:id', (done) => {
    service.get_user_by_id('123').subscribe((data) => {
      expect(data).toEqual({ id: '123', login: 'u' });
      done();
    });
    const req = httpMock.expectOne('/api/read/student/123');
    expect(req.request.method).toBe('GET');
    req.flush({ id: '123', login: 'u' });
  });

  it('get_user should map API response to Student', (done) => {
    const api = { id: 2, login: 'jane', firstname: 'Jane', lastname: 'Doe', datecreation: '2025-01-01', datemiseajour: '2025-01-02' };
    service.get_user('jane').subscribe((s) => {
      expect(s.login).toBe('jane');
      expect(s.firstname).toBe('Jane');
      expect(s.lastname).toBe('Doe');
      expect(s.datecreation).toBe('2025-01-01');
      expect(s.datemiseajour).toBe('2025-01-02');
      done();
    });
    const req = httpMock.expectOne('/api/read/student/jane');
    req.flush(api);
  });

  it('get_user should use alternative field names (firstName, created_at)', (done) => {
    const api = { id: 3, login: 'bob', firstName: 'Bob', lastName: 'Smith', created_at: '2024-01-01', updated_at: '2024-01-02' };
    service.get_user('bob').subscribe((s) => {
      expect(s.firstname).toBe('Bob');
      expect(s.lastname).toBe('Smith');
      expect(s.datecreation).toBe('2024-01-01');
      expect(s.datemiseajour).toBe('2024-01-02');
      done();
    });
    const req = httpMock.expectOne('/api/read/student/bob');
    req.flush(api);
  });

  it('update_user should PUT and map response to Student', (done) => {
    const api = { id: 4, login: 'x', firstname: 'X', lastname: 'Y', datecreation: '', datemiseajour: '' };
    service.update_user('x', { firstName: 'X', lastName: 'Y' }).subscribe((s) => {
      expect(s.firstname).toBe('X');
      expect(s.lastname).toBe('Y');
      done();
    });
    const req = httpMock.expectOne('/api/update/student/x');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ firstName: 'X', lastName: 'Y' });
    req.flush(api);
  });

  it('get_all_users should use snake_case fields when present', (done) => {
    const apiResponse = [
      { id: 10, login: 'u', firstname: 'F', lastname: 'L', datecreation: '2020-01-01', datemiseajour: '2020-01-02' },
    ];
    service.get_all_users().subscribe((students) => {
      expect(students[0].firstname).toBe('F');
      expect(students[0].lastname).toBe('L');
      expect(students[0].datecreation).toBe('2020-01-01');
      expect(students[0].datemiseajour).toBe('2020-01-02');
      done();
    });
    const req = httpMock.expectOne('/api/read/students');
    req.flush(apiResponse);
  });

  it('login should extract token from error body in catchError', (done) => {
    service.login({ login: 'u', password: 'p' }).subscribe((res) => {
      expect(res.token).toBe('recovery-token');
      done();
    });
    const req = httpMock.expectOne('/api/login');
    req.flush({ token: 'recovery-token' }, { status: 400, statusText: 'Bad Request' });
  });

  it('login should throw when response has no token', (done) => {
    service.login({ login: 'u', password: 'p' }).subscribe({
      next: () => fail('expected error'),
      error: (err) => {
        expect(err).toBeDefined();
        done();
      },
    });
    const req = httpMock.expectOne('/api/login');
    req.flush('', { status: 200, statusText: 'OK' });
  });
});
