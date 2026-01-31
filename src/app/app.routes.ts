import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { StudentsComponent } from './pages/students/students.component';
import { UpdateComponent } from './pages/update/update.component';
import { DeleteComponent } from './pages/delete/delete.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'students',
    component: StudentsComponent,
    canActivate: [authGuard],
    data: { mode: 'list' },
  },
  {
    path: 'students/update',
    component: StudentsComponent,
    canActivate: [authGuard],
    data: { mode: 'update' },
  },
  {
    path: 'students/update/:login',
    component: UpdateComponent,
    canActivate: [authGuard],
  },
  {
    path: 'students/delete',
    component: StudentsComponent,
    canActivate: [authGuard],
    data: { mode: 'delete' },
  },
  {
    path: 'students/delete/:login',
    component: DeleteComponent,
    canActivate: [authGuard],
  },
];
