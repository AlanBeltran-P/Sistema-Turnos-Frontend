import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ETIQUETAS_ESTADO, TurnoResponse } from '../../../core/models/turno.model';
import { ClienteTurnoService } from '../../../core/services/cliente-turno.service';
import { PublicService } from '../../../core/services/public.service';
import { SLUG_DEMO } from '../../../shared/demo';
import { fechaEnDias } from '../../../shared/utils/tiempo';

@Component({
  selector: 'app-mis-turnos',
  imports: [DatePipe, RouterLink],
  templateUrl: './mis-turnos.html',
  styleUrl: './mis-turnos.css',
})
export class MisTurnos implements OnInit {
  private readonly clienteTurnoService = inject(ClienteTurnoService);
  private readonly publicService = inject(PublicService);
  private readonly turnos = signal<TurnoResponse[]>([]);

  protected readonly proximos = computed(() => this.turnos().filter(esProximo));
  protected readonly historial = computed(() => this.turnos().filter((turno) => !esProximo(turno)).reverse());
  protected readonly etiquetas = ETIQUETAS_ESTADO;
  protected readonly slugDemo = SLUG_DEMO;

  ngOnInit(): void {
    this.cargar();
  }

  cancelar(turno: TurnoResponse): void {
    this.publicService.cancelar(turno.cancelacionToken).subscribe(() => this.cargar());
  }

  private cargar(): void {
    this.clienteTurnoService.misTurnos().subscribe((turnos) => this.turnos.set(turnos));
  }
}

/** Próximo = desde hoy en adelante y todavía activo (pendiente o confirmado). */
function esProximo(turno: TurnoResponse): boolean {
  const activo = turno.estado === 'PENDIENTE' || turno.estado === 'CONFIRMADO';
  return activo && turno.fechaHoraInicio.slice(0, 10) >= fechaEnDias(0);
}
