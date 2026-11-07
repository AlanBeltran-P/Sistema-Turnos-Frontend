import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PublicService } from '../../core/services/public.service';

/** Pantalla pública /cancelar y /cancelar/:token: el cliente cancela con su código, sin cuenta. */
@Component({
  selector: 'app-cancelar',
  imports: [FormsModule, RouterLink],
  templateUrl: './cancelar.html',
  styleUrl: './cancelar.css',
})
export class Cancelar {
  private readonly publicService = inject(PublicService);

  /** Si se llega con el link /cancelar/:token, el código ya viene cargado. */
  protected readonly codigo = signal(inject(ActivatedRoute).snapshot.paramMap.get('token') ?? '');
  protected readonly cancelado = signal(false);
  protected readonly error = signal<string | null>(null);

  cancelar(): void {
    this.error.set(null);
    this.publicService.cancelar(this.codigo().trim()).subscribe({
      next: () => this.cancelado.set(true),
      error: (error: Error) => this.error.set(error.message),
    });
  }
}
