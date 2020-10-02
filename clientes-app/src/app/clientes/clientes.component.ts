import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import{ClienteService } from "./cliente.service"
import{ModalService}from './detalle/modal.service';
import{tap} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
//import { CLIENTES } from "./clientes.json";

//una vez importado lo podemos inyectar 
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {
  clientes: Cliente [ ] ;
  paginador:any;
  clienteSeleccionado:Cliente;
  //A qui vamos a inyectar inyeccion de dependencias 
  //vamos a definir un atributo de la clase 
  //Asignar el cliente service al atributo
  constructor(private clienteService: ClienteService,
    private modalService:ModalService,  
    public authService:AuthService,
    private activatedRoute: ActivatedRoute 
      
    ) { 
    
  }
   
 
  
  //asignar el valor clientes = clientes 
  /** on initi parte del metodo del ciclo de vida del compoenente que se va a llamar o incvocar
   * una solamente cuando se inicia necesitamos una forma de detectar el parametro page 
   * cuando cambia el parametro  se va a catualizar la consulta del paginador con los rangos
   * por que por defecto el enrutador reutiliza siempre la instancia compoenente cuando se vuelve
   * a navegar a travez de el estamos simpre navegando dentro de un mismo compoenente pero 
   * para eso encesitoamos un obseravable ya que tiene que vigilar el cambio del parametro 
   * solamente cambia el parametro  entonces para resumir el activatedRoute.paramMap
   * se encarga de suscribir un  observador cada vez que cambia el parametro page
   * en la ruta cada que hacemos in click en las paginas se va a actualizar
   * tambien es improtante el ciclo de vida de este componente va a mantener
   *   
  */
  ngOnInit(){

    //no olvidar parentesis 
    /** vamos a pasar la paginacion a qui por ahora */
       this.activatedRoute.paramMap.subscribe( params => {
      let page:number = +params.get('page');
      
      if(!page){
          
        page = 0;

      }
      this.clienteService.getClientes(page)
    .pipe(
      tap((response :any) => {
        
        console.log('ClientesComponent: tap3');
          (response.content as Cliente[]).forEach( cliente => {
  
            console.log(cliente.nombre);
          })



      })

    ).subscribe(
      //dentro deeste metodo el observador
      //seria asignar en el atributo clientes el valor  que se esta recibiendo desde cliente servie 
      //asigans paramtros a this.clientes 
      /*
        forma mas larga de hacerlo 
      function (clientes)
      {
        this.cllientes = clientes
      }
      
      */
      
      //usamo parentesis si usamos mas de un argumento 
      (response) => {
        this.clientes = response.content as Cliente[];
        this.paginador = response ;
        }
      );
    }
      );
      /*recordemos  que estamos  emitiendo un cliente con la funcion anonima lamda
       vamos a tener  el cliente  con la la foto actulizada podemos hacer algo 
       con este cleinte por ejemplo recorrer el listado cliente recorremos 
       cada cliente y preguntamos  si el cliente id  de cada  cliente  de 
       la tabla  de la lista  es igual al cliente id  que estamos  emitiendo 
       si son iguales enotnces le cambiamos la imagen se la actualizamos
       y recordemos que el map nos permite cambiar o midificar algo    
      */
      this.modalService.notificarUpload.subscribe(cliente => {
        this.clientes = this.clientes.map(clienteOriginal => {
          //preguntamos si el cliente id es igual al id del cliente original  
          if(cliente.id == clienteOriginal.id){
            
            //entoncnes le pasamos la foto actualizada 
            clienteOriginal.foto = cliente.foto;    
        

            }
            return clienteOriginal
         })
      })
    
  
  }
  
  delete(cliente: Cliente): void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Seguro que deseas borrarlo?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: ' Si ,Eliminalo!',
      
      cancelButtonText: 'No,cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.clienteService.delete(cliente.id).subscribe(
        
          
        response =>{ 
          this.clientes = this.clientes.filter(cli => cli !== cliente)      
          swalWithBootstrapButtons.fire(
          'Cliente eliminado!',
          `Cliente ${cliente.nombre}  eliminado con exito `,
          'success'
            )  
          }
        
        )
        
      }
    
      
    
    
    } )
    

  }
  /**asignamos el atributo al cliente seleccionaos a qui asiganamos el cliente seleccionado 
   * justo a qui tenemos que invoar el emtodo abrir molad de la clase moaldService   
   */
  abrirModal(cliente: Cliente){
    
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();


  }
}
