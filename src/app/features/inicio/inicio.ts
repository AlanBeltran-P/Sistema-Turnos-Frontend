import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SLUG_DEMO } from '../../shared/demo';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  protected readonly slugDemo = SLUG_DEMO;
}
