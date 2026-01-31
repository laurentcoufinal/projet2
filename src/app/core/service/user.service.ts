import { Injectable } from '@angular/core';
import { Register } from '../models/Register';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Login } from '../models/Login';
import { LoginResponse } from '../models/LoginResponse';

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
    // Le serveur renvoie le token directement en texte brut, pas en JSON
    // On utilise responseType: 'text' et on transforme la réponse
    return this.httpClient.post('/api/login', user, { 
      responseType: 'text',
      headers: new HttpHeaders({ 'Accept': 'text/plain, application/json' })
    }).pipe(
      map((token: string) => {
        // Transformer la réponse texte en objet LoginResponse
        return { token } as LoginResponse;
      })
    );
  }
  get_all_users(): Observable<any[]> {
    return this.httpClient.get<any[]>('/api/read/students');
  }
  get_user_by_id(id: string): Observable<any> {
    return this.httpClient.get<any>(`/api/read/student/${id}`);
  }
  delete_user(id: string): Observable<any> {
    return this.httpClient.delete<any>(`/api/delete/student/${id}`);
  }
}
