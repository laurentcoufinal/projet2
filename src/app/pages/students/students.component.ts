import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/service/user.service';
import { AuthService } from '../../core/service/auth.service';
import { Student } from '../../core/models/Student';

type ListMode = 'list' | 'update' | 'delete';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css',
})
export class StudentsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  students: Student[] = [];
  loading = true;
  error: string | null = null;
  mode: ListMode = 'list';

  ngOnInit(): void {
    this.mode = (this.route.snapshot.data['mode'] as ListMode) ?? 'list';
    this.route.data.subscribe((data) => {
      this.mode = (data['mode'] as ListMode) ?? 'list';
    });
    this.userService.get_all_users().subscribe({
      next: (list) => {
        this.students = list;
        this.loading = false;
        this.error = null;
      },
      error: (err) => {
        this.loading = false;
        if (err?.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
          return;
        }
        this.error = err?.message ?? 'Impossible de charger la liste des étudiants.';
      },
    });
  }
}
