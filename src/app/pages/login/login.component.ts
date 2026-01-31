import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../../core/models/Login';
import { UserService } from '../../core/service/user.service';
import { AuthService } from '../../core/service/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  loginForm: FormGroup = new FormGroup({});
  submitted = false;
  /** Message d'erreur affiché dans l'UI (ex. "Erreur de login") */
  loginError: string | null = null;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const loginUser: Login = {
      login: this.loginForm.get('login')?.value ?? '',
      password: this.loginForm.get('password')?.value ?? ''
    };
    this.loginError = null;
    this.userService.login(loginUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response?.token) {
            this.authService.setToken(response.token);
            setTimeout(() => this.router.navigate(['/'], { replaceUrl: true }), 0);
          } else {
            this.loginError = 'Erreur de login : réponse invalide.';
          }
        },
        error: (err: { status?: number; message?: string }) => {
          const status = err?.status;
          const msg = err?.message ?? '';
          if (status === 401) {
            this.loginError = 'Erreur de login : identifiants incorrects.';
          } else if (msg.includes('Token manquant')) {
            this.loginError = 'Erreur de login : le serveur n\'a pas renvoyé de token.';
          } else {
            this.loginError = 'Erreur de login. Réessayez ou contactez l\'administrateur.';
          }
          if (typeof console !== 'undefined' && console.warn) {
            console.warn('Login failed', { status });
          }
        },
      });
  }
  onReset(): void {
    this.submitted = false;
    this.loginError = null;
    this.loginForm.reset();
  }
}
