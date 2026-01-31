import { Injectable } from '@angular/core';
import { Register } from '../models/Register';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Login } from '../models/Login';
import { LoginResponse } from '../models/LoginResponse';
import { Student } from '../models/Student';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private readonly httpClient: HttpClient) { }

  register(user: Register): Observable<Object> {
    console.log('register', user);
    return this.httpClient.post('/api/register', user);
  }

  login(user: Login): Observable<LoginResponse> {
    console.log('login', user);
    const opts = {
      responseType: 'text' as const,
      headers: new HttpHeaders({ 'Accept': 'application/json, text/plain' }),
    };
    return this.httpClient.post('/api/login', user, opts).pipe(
      map((body: string) => {
        const res = this.toLoginResponse(body);
        if (!res) throw new Error('Token manquant dans la réponse du serveur');
        return res;
      }),
      catchError((err) => {
        const body = err?.error;
        if (body !== undefined && body !== null) {
          const res = this.toLoginResponse(body);
          if (res) return of(res);
        }
        throw err;
      })
    );
  }

  private toLoginResponse(body: unknown): LoginResponse | null {
    const token = this.extractTokenFromResponse(body);
    if (!token) {
      console.error('Réponse login (aucun token trouvé). Réponse reçue:', body);
      return null;
    }
    return { token };
  }

  /**
   * Extrait le token (objet JSON parsé par Angular, ou chaîne texte/JSON).
   */
  private extractTokenFromResponse(body: unknown): string | null {
    if (body == null) return null;
    if (typeof body === 'string') {
      const trimmed = body.trim();
      if (!trimmed) return null;
      if (trimmed.startsWith('{')) {
        try {
          return this.extractTokenFromResponse(JSON.parse(trimmed));
        } catch {
          return null;
        }
      }
      return trimmed;
    }
    if (typeof body === 'object') {
      const obj = body as Record<string, unknown>;
      const keys = ['token', 'access_token', 'accessToken', 'jwt', 'id_token', 'bearer'];
      for (const k of keys) {
        const v = obj[k];
        if (typeof v === 'string') return v;
      }
      for (const nest of ['data', 'result', 'user', 'auth', 'payload']) {
        const sub = obj[nest];
        if (sub && typeof sub === 'object') {
          const t = this.extractTokenFromResponse(sub);
          if (t) return t;
        }
      }
    }
    return null;
  }
  get_all_users(): Observable<Student[]> {
    return this.httpClient.get<any[]>('/api/read/students').pipe(
      map((list) =>
        list.map((s: any) => ({
          id: s.id,
          login: s.login ?? '',
          firstname: s.firstname ?? s.firstName ?? '',
          lastname: s.lastname ?? s.lastName ?? '',
          datecreation: s.datecreation ?? s.created_at ?? s.createdAt ?? '',
          datemiseajour: s.datemiseajour ?? s.updated_at ?? s.updatedAt ?? '',
        }))
      )
    );
  }
  get_user_by_id(id: string): Observable<any> {
    return this.httpClient.get<any>(`/api/read/student/${id}`);
  }

  get_user(login: string): Observable<Student> {
    return this.httpClient.get<any>(`/api/read/student/${login}`).pipe(
      map((s: any) => ({
        id: s.id,
        login: s.login ?? '',
        firstname: s.firstname ?? s.firstName ?? '',
        lastname: s.lastname ?? s.lastName ?? '',
        datecreation: s.datecreation ?? s.created_at ?? s.createdAt ?? '',
        datemiseajour: s.datemiseajour ?? s.updated_at ?? s.updatedAt ?? '',
      }))
    );
  }

  update_user(login: string, body: { firstName: string; lastName: string }): Observable<Student> {
    return this.httpClient.put<any>(`/api/update/student/${login}`, body).pipe(
      map((s: any) => ({
        id: s.id,
        login: s.login ?? '',
        firstname: s.firstname ?? s.firstName ?? '',
        lastname: s.lastname ?? s.lastName ?? '',
        datecreation: s.datecreation ?? s.created_at ?? s.createdAt ?? '',
        datemiseajour: s.datemiseajour ?? s.updated_at ?? s.updatedAt ?? '',
      }))
    );
  }

  delete_user(id: string): Observable<any> {
    return this.httpClient.delete<any>(`/api/delete/student/${id}`);
  }
}
