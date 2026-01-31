import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/service/user.service';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './update.component.html',
  styleUrl: './update.component.css',
})
export class UpdateComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly formBuilder = inject(FormBuilder);

  updateForm: FormGroup = this.formBuilder.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
  });

  login: string | null = null;
  loading = true;
  saving = false;
  error: string | null = null;
  submitted = false;

  get form() {
    return this.updateForm.controls;
  }

  ngOnInit(): void {
    const loginParam = this.route.snapshot.paramMap.get('login');
    if (!loginParam) {
      this.error = 'Login manquant.';
      this.loading = false;
      return;
    }
    this.login = loginParam;
    this.userService.get_user(loginParam).subscribe({
      next: (student) => {
        this.updateForm.patchValue({
          firstname: student.firstname,
          lastname: student.lastname,
        });
        this.loading = false;
        this.error = null;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.status === 404
          ? 'Étudiant introuvable.'
          : (err?.message ?? 'Impossible de charger l\'étudiant.');
      },
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.updateForm.invalid || !this.login) return;

    this.saving = true;
    this.error = null;
    const firstname = this.updateForm.get('firstname')?.value ?? '';
    const lastname = this.updateForm.get('lastname')?.value ?? '';

    this.userService.update_user(this.login, { firstName: firstname, lastName: lastname }).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/students']);
      },
      error: (err) => {
        this.saving = false;
        this.error = err?.message ?? 'Erreur lors de la mise à jour.';
      },
    });
  }
}
