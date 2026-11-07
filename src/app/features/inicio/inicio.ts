import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** En la demo hay un solo profesional. En la realidad, el cliente llega con el link que le pasa su profesional. */
const SLUG_DEMO = 'laura-gomez';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  protected readonly slugDemo = SLUG_DEMO;
}
