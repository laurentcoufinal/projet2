import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/service/user.service';
import { Student } from '../../core/models/Student';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css',
})
export class DeleteComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  login: string | null = null;
  student: Student | null = null;
  loading = true;
  deleting = false;
  error: string | null = null;

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
        this.student = student;
        this.loading = false;
        this.error = null;
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.status === 404
            ? 'Étudiant introuvable.'
            : (err?.message ?? 'Impossible de charger l\'étudiant.');
      },
    });
  }

  confirmDelete(): void {
    if (!this.login) return;
    this.deleting = true;
    this.error = null;
    this.userService.delete_user(this.login).subscribe({
      next: () => {
        this.deleting = false;
        this.router.navigate(['/students']);
      },
      error: (err) => {
        this.deleting = false;
        this.error = err?.message ?? 'Erreur lors de la suppression.';
      },
    });
  }
}
