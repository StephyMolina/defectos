import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent],
  template: `
    <div class="app-container">
      <main>
        <app-dashboard></app-dashboard>
      </main>
      <footer>
        <p>&copy; 2026 Tablero ARANDA - Sistema de Métricas y Servicios</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    main {
      flex: 1;
      background: #f0f2f5;
    }

    footer {
      background: #333;
      color: white;
      text-align: center;
      padding: 15px;
      margin-top: auto;
    }

    footer p {
      margin: 0;
    }
  `]
})
export class AppComponent {
  title = 'tablero-frontend';
}
