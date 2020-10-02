import { Injectable,EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  //a qui tnedremos el atributo modal de tipo  boolean por defecto un false   
  modal: boolean = false ;
 //usaremos un atributo que nos ayudara a no reresacar la pagina 
/** creamos el atributo con el metodo EventEmitter */
 private _notificarUpload = new EventEmitter<any>(); 

  constructor() { }
  /** tenemos que tener 2 metodos  para  abrir el modal  y cerrar el modal   */
 /** debajo del contruvto tendremos el metotod ger */
 get notificarUpload():EventEmitter<any>{

  return this._notificarUpload;
 }
 
 
  abrirModal(){
    
    this.modal = true ;

  }
  cerrarModal(){
     
    this.modal = false ;
  }


}
