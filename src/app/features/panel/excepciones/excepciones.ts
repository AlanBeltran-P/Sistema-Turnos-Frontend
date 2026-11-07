import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExcepcionRequest, ExcepcionResponse } from '../../../core/models/excepcion.model';
import { ExcepcionService } from '../../../core/services/excepcion.service';
import { fechaEnDias } from '../../../shared/utils/tiempo';

@Component({
  selector: 'app-excepciones',
  imports: [FormsModule, DatePipe],
  templateUrl: './excepciones.html',
  styleUrl: './excepciones.css',
})
export class Excepciones implements OnInit {
  private readonly excepcionService = inject(ExcepcionService);

  protected readonly hoy = fechaEnDias(0);
  protected readonly excepciones = signal<ExcepcionResponse[]>([]);

  // Formulario
  protected readonly fecha = signal('');
  protected readonly todoElDia = signal(true);
  protected readonly horaInicio = signal('09:00');
  protected readonly horaFin = signal('13:00');
  protected readonly motivo = signal('');
  protected readonly horarioValido = computed(() => this.todoElDia() || this.horaInicio() < this.horaFin());

  ngOnInit(): void {
    this.cargar();
  }

  guardar(): void {
    const request: ExcepcionRequest = {
      fecha: this.fecha(),
      horaInicio: this.todoElDia() ? null : this.horaInicio(),
      horaFin: this.todoElDia() ? null : this.horaFin(),
      motivo: this.motivo() || null,
    };
    this.excepcionService.crear(request).subscribe(() => {
      this.limpiarFormulario();
      this.cargar();
    });
  }

  eliminar(excepcion: ExcepcionResponse): void {
    this.excepcionService.eliminar(excepcion.id).subscribe(() => this.cargar());
  }

  private limpiarFormulario(): void {
    this.fecha.set('');
    this.todoElDia.set(true);
    this.horaInicio.set('09:00');
    this.horaFin.set('13:00');
    this.motivo.set('');
  }

  private cargar(): void {
    this.excepcionService.listarPropias().subscribe((lista) => {
      this.excepciones.set(lista.sort((a, b) => a.fecha.localeCompare(b.fecha)));
    });
  }
}
