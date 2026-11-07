import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-panel-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './panel-layout.html',
  styleUrl: './panel-layout.css',
})
export class PanelLayout {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly profesional = this.auth.profesional();

  salir(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
