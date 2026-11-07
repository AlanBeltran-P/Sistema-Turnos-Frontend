import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DisponibilidadRequest, DisponibilidadResponse } from '../../../core/models/disponibilidad.model';
import { DisponibilidadService } from '../../../core/services/disponibilidad.service';

/** El índice es el diaSemana del back: 0 = domingo ... 6 = sábado. */
const NOMBRES_DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

@Component({
  selector: 'app-disponibilidad',
  imports: [FormsModule],
  templateUrl: './disponibilidad.html',
  styleUrl: './disponibilidad.css',
})
export class Disponibilidad implements OnInit {
  private readonly disponibilidadService = inject(DisponibilidadService);

  protected readonly nombresDias = NOMBRES_DIAS;
  protected readonly disponibilidades = signal<DisponibilidadResponse[]>([]);
  protected readonly editando = signal<DisponibilidadResponse | null>(null);

  // Formulario
  protected readonly diaSemana = signal(1);
  protected readonly horaInicio = signal('09:00');
  protected readonly horaFin = signal('13:00');
  protected readonly horarioValido = computed(() => this.horaInicio() < this.horaFin());

  ngOnInit(): void {
    this.cargar();
  }

  guardar(): void {
    const request: DisponibilidadRequest = {
      diaSemana: this.diaSemana(),
      horaInicio: this.horaInicio(),
      horaFin: this.horaFin(),
    };
    const editando = this.editando();
    const pedido = editando
      ? this.disponibilidadService.actualizar(editando.id, request)
      : this.disponibilidadService.crear(request);
    pedido.subscribe(() => {
      this.limpiarFormulario();
      this.cargar();
    });
  }

  editar(disponibilidad: DisponibilidadResponse): void {
    this.editando.set(disponibilidad);
    this.diaSemana.set(disponibilidad.diaSemana);
    this.horaInicio.set(disponibilidad.horaInicio);
    this.horaFin.set(disponibilidad.horaFin);
  }

  eliminar(disponibilidad: DisponibilidadResponse): void {
    this.disponibilidadService.eliminar(disponibilidad.id).subscribe(() => this.cargar());
  }

  limpiarFormulario(): void {
    this.editando.set(null);
    this.diaSemana.set(1);
    this.horaInicio.set('09:00');
    this.horaFin.set('13:00');
  }

  /** Ordena por día y, dentro del mismo día, por hora de inicio. */
  private cargar(): void {
    this.disponibilidadService.listarPropias().subscribe((lista) => {
      const ordenada = lista.sort((a, b) => a.diaSemana - b.diaSemana || a.horaInicio.localeCompare(b.horaInicio));
      this.disponibilidades.set(ordenada);
    });
  }
}
