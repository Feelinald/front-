import { Component } from '@angular/core';
//importatan decaradores
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',// Asociado a una vista a qui
  styleUrls: ['./app.component.css']
})
//Registrar y
export class AppComponent {
  title = 'Bienvenido a angular';

//opcionnal   cruso:String = "Curso con spring con angular 7";


  curso = "Curso con spring con angular 7";
  alumno:string = 'Castillo Villegas Aldair ';
}
