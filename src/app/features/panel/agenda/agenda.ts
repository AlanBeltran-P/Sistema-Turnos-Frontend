import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ETIQUETAS_ESTADO, EstadoTurno, TurnoAgendaResponse } from '../../../core/models/turno.model';
import { TurnoService } from '../../../core/services/turno.service';
import { fechaEnDias } from '../../../shared/utils/tiempo';

@Component({
  selector: 'app-agenda',
  imports: [FormsModule, DatePipe],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class Agenda implements OnInit {
  private readonly turnoService = inject(TurnoService);

  protected readonly desde = signal(fechaEnDias(0));
  protected readonly hasta = signal(fechaEnDias(6));
  protected readonly turnos = signal<TurnoAgendaResponse[]>([]);
  protected readonly etiquetas = ETIQUETAS_ESTADO;

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    this.turnoService.verAgenda(this.desde(), this.hasta()).subscribe((turnos) => this.turnos.set(turnos));
  }

  cambiarEstado(turno: TurnoAgendaResponse, nuevoEstado: EstadoTurno): void {
    this.turnoService.cambiarEstado(turno.publicId, { nuevoEstado }).subscribe(() => this.buscar());
  }

  /** Solo se pueden cambiar los turnos que todavía no se cerraron. */
  esModificable(turno: TurnoAgendaResponse): boolean {
    return turno.estado === 'PENDIENTE' || turno.estado === 'CONFIRMADO';
  }
}
