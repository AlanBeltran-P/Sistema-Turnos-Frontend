import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServicioRequest, ServicioResponse } from '../../../core/models/servicio.model';
import { ServicioService } from '../../../core/services/servicio.service';

@Component({
  selector: 'app-servicios',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})
export class Servicios implements OnInit {
  private readonly servicioService = inject(ServicioService);

  protected readonly servicios = signal<ServicioResponse[]>([]);
  protected readonly editando = signal<ServicioResponse | null>(null);

  // Formulario
  protected readonly nombre = signal('');
  protected readonly duracionMin = signal(30);
  protected readonly precio = signal(0);

  ngOnInit(): void {
    this.cargar();
  }

  guardar(): void {
    const request: ServicioRequest = { nombre: this.nombre(), duracionMin: this.duracionMin(), precio: this.precio() };
    const editando = this.editando();
    const pedido = editando
      ? this.servicioService.actualizar(editando.publicId, request)
      : this.servicioService.crear(request);
    pedido.subscribe(() => {
      this.limpiarFormulario();
      this.cargar();
    });
  }

  editar(servicio: ServicioResponse): void {
    this.editando.set(servicio);
    this.nombre.set(servicio.nombre);
    this.duracionMin.set(servicio.duracionMin);
    this.precio.set(servicio.precio);
  }

  desactivar(servicio: ServicioResponse): void {
    this.servicioService.desactivar(servicio.publicId).subscribe(() => this.cargar());
  }

  limpiarFormulario(): void {
    this.editando.set(null);
    this.nombre.set('');
    this.duracionMin.set(30);
    this.precio.set(0);
  }

  private cargar(): void {
    this.servicioService.listarPropios().subscribe((servicios) => this.servicios.set(servicios));
  }
}
