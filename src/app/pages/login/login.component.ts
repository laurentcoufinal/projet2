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
  submitted: boolean = false;

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
    this.userService.login(loginUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response?.token) {
            this.authService.setToken(response.token);
            // Redirection au prochain cycle pour que le guard voie bien le token
            setTimeout(() => this.router.navigate(['/'], { replaceUrl: true }), 0);
          } else {
            alert('Réponse de connexion invalide.');
          }
        },
        error: (error) => {
          console.error('Erreur de connexion:', { status: error?.status, body: error?.error, message: error?.message });
          if (error?.status === 401) {
            alert('Identifiants incorrects.');
          } else if (error?.message?.includes('Token manquant')) {
            alert('Le serveur n\'a pas renvoyé de token. Vérifiez la console (F12) pour voir la réponse.');
          } else {
            alert('Erreur de connexion. Vérifiez la console (F12) pour plus de détails.');
          }
        }
      });
  }
  onReset(): void {
    this.submitted = false;
    this.loginForm.reset();
  }
}
