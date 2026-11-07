import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SlotDisponibleResponse } from '../../core/models/disponibilidad.model';
import { ProfesionalPublicoResponse } from '../../core/models/profesional.model';
import { ServicioResponse } from '../../core/models/servicio.model';
import { ReservaRequest, TurnoResponse } from '../../core/models/turno.model';
import { ClienteAuthService } from '../../core/services/cliente-auth.service';
import { PublicService } from '../../core/services/public.service';
import { fechaEnDias } from '../../shared/utils/tiempo';

/** Pantalla pública /reservar/:slug: servicio → día → horario → datos → confirmación. */
@Component({
  selector: 'app-reserva',
  imports: [FormsModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './reserva.html',
  styleUrl: './reserva.css',
})
export class Reserva implements OnInit {
  private readonly publicService = inject(PublicService);
  private readonly slug = inject(ActivatedRoute).snapshot.paramMap.get('slug') ?? '';
  private readonly clienteAuth = inject(ClienteAuthService);

  protected readonly cliente = this.clienteAuth.cliente;

  protected readonly hoy = fechaEnDias(0);
  protected readonly profesional = signal<ProfesionalPublicoResponse | null>(null);
  protected readonly servicios = signal<ServicioResponse[]>([]);
  protected readonly servicioElegido = signal<ServicioResponse | null>(null);
  protected readonly fecha = signal('');
  protected readonly horarios = signal<SlotDisponibleResponse[]>([]);
  protected readonly horaElegida = signal<string | null>(null);
  protected readonly turno = signal<TurnoResponse | null>(null);
  protected readonly cancelado = signal(false);
  protected readonly error = signal<string | null>(null);

  // Datos del cliente
  protected readonly nombre = signal('');
  protected readonly telefono = signal('');
  protected readonly email = signal('');

  ngOnInit(): void {
    this.completarDatosDelCliente();
    this.publicService.obtenerProfesional(this.slug).subscribe({
      next: (profesional) => this.profesional.set(profesional),
      error: (error: Error) => this.error.set(error.message),
    });
    this.publicService.listarServicios(this.slug).subscribe({
      next: (servicios) => this.servicios.set(servicios),
      error: (error: Error) => this.error.set(error.message),
    });
  }

  elegirServicio(servicio: ServicioResponse): void {
    this.servicioElegido.set(servicio);
    this.buscarHorarios();
  }

  elegirFecha(fecha: string): void {
    this.fecha.set(fecha);
    this.buscarHorarios();
  }

  elegirHora(hora: string): void {
    this.horaElegida.set(hora);
    this.error.set(null);
  }

  reservar(): void {
    const servicio = this.servicioElegido();
    const hora = this.horaElegida();
    if (!servicio || !hora) {
      return;
    }
    this.publicService.reservar(this.slug, this.armarReserva(servicio, hora)).subscribe({
      next: (turno) => this.turno.set(turno),
      error: (error: Error) => {
        this.error.set(error.message);
        this.buscarHorarios();
      },
    });
  }

  cancelar(): void {
    const turno = this.turno();
    if (!turno) {
      return;
    }
    this.publicService.cancelar(turno.cancelacionToken).subscribe({
      next: () => this.cancelado.set(true),
      error: (error: Error) => this.error.set(error.message),
    });
  }

  /** Busca los horarios libres cuando ya hay servicio y fecha elegidos. */
  private buscarHorarios(): void {
    const servicio = this.servicioElegido();
    this.horaElegida.set(null);
    if (!servicio || !this.fecha()) {
      return;
    }
    this.publicService.consultarDisponibilidad(this.slug, servicio.publicId, this.fecha()).subscribe({
      next: (horarios) => this.horarios.set(horarios),
      error: (error: Error) => this.error.set(error.message),
    });
  }

  /** Si el cliente ingresó a su cuenta, no hace falta que escriba sus datos. */
  private completarDatosDelCliente(): void {
    const cliente = this.clienteAuth.cliente();
    if (cliente) {
      this.nombre.set(cliente.nombre);
      this.telefono.set(cliente.telefono);
      this.email.set(cliente.email);
    }
  }

  private armarReserva(servicio: ServicioResponse, hora: string): ReservaRequest {
    return {
      servicioPublicId: servicio.publicId,
      fechaHoraInicio: `${this.fecha()}T${hora}`,
      clienteNombre: this.nombre(),
      clienteTelefono: this.telefono(),
      clienteEmail: this.email() || null,
    };
  }
}
