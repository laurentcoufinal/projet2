import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from '../../core/models/Login';
import { UserService } from '../../core/service/user.service';
import { AuthService } from '../../core/service/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
@Component({
  selector: 'app-login',
  imports: [CommonModule, MaterialModule],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
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
      login: this.loginForm.get('login')?.value,
      password: this.loginForm.get('password')?.value
    };
    this.userService.login(loginUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          // Stocker le token JWT dans le localStorage
          this.authService.setToken(response.token);
          alert('SUCCESS!! :-)');
          // TODO : rediriger vers la page d'accueil ou dashboard
        },
        error: (error) => {
          console.error('Erreur de connexion:', error);
          alert('Erreur de connexion. Veuillez vérifier vos identifiants.');
        }
      });
  }
  onReset(): void {
    this.submitted = false;
    this.loginForm.reset();
  }
}
