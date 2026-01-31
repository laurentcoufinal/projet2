import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

  /**
   * Stocke le token JWT dans le localStorage
   * @param token Le token JWT à stocker
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Récupère le token JWT depuis le localStorage
   * @returns Le token JWT ou null s'il n'existe pas
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Vérifie si l'utilisateur est authentifié (token présent)
   * @returns true si un token existe, false sinon
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Supprime le token JWT du localStorage (déconnexion)
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Récupère le token pour l'utiliser dans les en-têtes HTTP
   * @returns Le token avec le préfixe "Bearer " ou null
   */
  getAuthHeader(): string | null {
    const token = this.getToken();
    return token ? `Bearer ${token}` : null;
  }
}
