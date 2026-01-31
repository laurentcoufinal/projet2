import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterLink, RouterOutlet],
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'etudiant-frontend';
}
