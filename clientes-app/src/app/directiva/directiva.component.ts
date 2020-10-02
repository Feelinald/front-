import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',

})
export class DirectivaComponent  {

//Creamos un atributo con el nombre listacurso
//Nota usar notacion camello
  listaCurso:string[ ] = ['TypeScript', 'JavaScript','java SE','c++','netlogo'];
  //La idea es iterar sobre este arreglo
 
  habilitar : boolean = true;


  constructor() { }

    //creamos una metodo 
    setHabilitar():void{

      this.habilitar = (this.habilitar== true)? false:true;
    }
 

}
