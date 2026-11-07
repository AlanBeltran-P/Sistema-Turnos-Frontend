import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { SERVICIOS_MOCK } from '../mocks/datos-mock';
import { ClienteAuthService } from './cliente-auth.service';
import { ClienteTurnoService } from './cliente-turno.service';
import { PublicService } from './public.service';

describe('ClienteTurnoService', () => {
  let service: ClienteTurnoService;
  let clienteAuth: ClienteAuthService;

  beforeEach(() => {
    service = TestBed.inject(ClienteTurnoService);
    clienteAuth = TestBed.inject(ClienteAuthService);
  });

  async function ingresarComoAna(): Promise<void> {
    await firstValueFrom(clienteAuth.login({ email: 'ana@demo.com', password: '12345678' }));
  }

  it('sin sesión no devuelve turnos', async () => {
    await expect(firstValueFrom(service.misTurnos())).rejects.toThrow('Tenés que ingresar a tu cuenta');
  });

  it('devuelve solo los turnos del cliente, ordenados por fecha', async () => {
    await ingresarComoAna();
    const turnos = await firstValueFrom(service.misTurnos());
    expect(turnos.map((turno) => turno.publicId)).toEqual(['t-06', 't-07']);
  });

  it('una reserva hecha con la sesión abierta aparece en mis turnos', async () => {
    await ingresarComoAna();
    await firstValueFrom(
      TestBed.inject(PublicService).reservar('laura-gomez', {
        servicioPublicId: SERVICIOS_MOCK[0].publicId,
        fechaHoraInicio: '2030-01-07T09:00',
        clienteNombre: 'Ana López',
        clienteTelefono: '11 1234-5678',
        clienteEmail: 'ana@demo.com',
      }),
    );
    const turnos = await firstValueFrom(service.misTurnos());
    expect(turnos.length).toBe(3);
  });

  it('un cliente nuevo no ve turnos de otros', async () => {
    await firstValueFrom(
      clienteAuth.registrar({ nombre: 'Pedro Gil', email: 'pedro@demo.com', telefono: '11 2222-3333', password: '12345678' }),
    );
    expect(await firstValueFrom(service.misTurnos())).toEqual([]);
  });
});
