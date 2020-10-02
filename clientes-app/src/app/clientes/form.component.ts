import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import {Router,ActivatedRoute} from '@angular/router'
import swal from  'sweetalert2' 
import { Region } from './region';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  
})
export class FormComponent implements OnInit {

  /*por lo tanto el formulario esta asignado
  y mapeado a un objeto este objeto es un atributo*/ 
  //creamos el atributo cliente+
 //inyectamos el create
 /*debemos tener un atributo un arreglo que contenga mensajes de errores
 del tipo string*/ 
  constructor(public  clienteService: ClienteService, 
    public router: Router,public activatedRoute:ActivatedRoute ) { }

  public cliente:  Cliente = new Cliente()
  
  public regiones:Region[]; 

  public titulo:string = "Crear cliente"

  public  errores:string[];
  
  ngOnInit(): void {
    this.cargarCliente();
  }
 /*asignala respuesta al atributo cliente la respuesta que seria del back end*/ 
   cargarCliente(): void{
//suscrbimos un observador que esta boservando cuando tenemos el id cuanodo se lo pasemos por parametro
    this.activatedRoute.params.subscribe(params => 
      {
      let id = params['id']  
  //obtenemos si el id existe utilizando al clace clienteService
      if (id){
        this.clienteService .getCliente(id).subscribe((cliente) => this.cliente = cliente)
      
      
      }


    });
    /** cada vez que se incializalize eñ formulario va a buscar al api rest 
     * para desplegarla en el control del formulario
     */
    this.clienteService.getRegiones().subscribe(regiones => this.regiones =  regiones);
  }
  
  /*como segundo parámetro podemos suscribir a un boservador y manejar cuando las cosas salen mal
    error que seria  el atributo de este objeto error que contiene el json y en el json
    pasamos los errores dentro del parametro errors */
  public create(): void{
    console.log(this.cliente);
    this.clienteService.create(this.cliente).
    subscribe( cliente => { 
      this.router.navigate(['/clientes'])
      swal.fire('Nuevo cliente' , `Ha sido creado con exito  ${cliente.nombre} `,'success')
      },
      err =>{
        this.errores = err.error.errors as string[]
        console.error('Código del error desde back end:'+ err.status);
        console.error(err.error.errors);
      }     
      )
    
  }

   public update(): void{ 
     //lo podemos llevar a la consolar del navegador 
    console.log(this.cliente);
    this.clienteService.update(this.cliente).
    subscribe( json  => {
      
      this.router.navigate(['/clientes'])
      swal.fire('Nuevo cliente' , `${json.mensaje}: ${json.cliente.nombre}  `,'success')
      },
      err =>{
        this.errores = err.error.errors as string[]
        console.error('Código del error desde back end:'+ err.status);
        console.error(err.error.errors);
      } 
    )
  }
  /**vamos a tener el metodo el primer objeto de tipo region
   * o1: pertenece a cada una de las regiones de *ngfor de la iteracion
   * o2: miestras que el objeto 2  esta asignado al cliente y es lo qeue tenemos que ocmparar.
   * va a retornar un booleano lo primero que tenemos que comparar si el bojeto uno es
   * distinto de null  y que el objeto dos tambien sea distinto de  null si cualquiera 
   * de los dos  es null retornamos un false  eontces primero  pregutnamos  si el objeto 
   * uno es igual a null o el dos es igual a null entonces retornamos false de lo contrario
   * si los dos objetos existen y estan deinidos entonces vamos a comaprar el id si el objeto uno
   * es igual al id de lobjeto uno retornamos true.
   * Es opcional definir los tipos  como retornar un booleanso ocn dos puntos podemos 
   * indicar el tipo de retorno, tambien se podria hacer un debug del cliente
   *  cada vez  que tengamos un nuevo cliente  o lo actualizemos .
   * En el codigo fuimos un poco estrictos por que usamos triple igual
   * es decir  que sea  identico  quiere decir que tenga  el mismo 
   * tipo de dato  y el ismo valor  el mismo tipo por ejemplo 
   *  que siempte sea del tipo null   peortambien podria ser 
   * undifed que no esta definido por lo tanot  tenemos dos 
   * soluciones  ser un poco menos estricto por ejemplo  usanso 
   * solamente doble igual  por valor y no por tipo  que no 
   * contenga valor  ya sea null o unidifined en cualquiera de las dos .
   * Otra alternativa es si es null el objeto uno  o null el objeto 2
   * o undifined  retornamos false 
   * antes del retorn tnedremos un if vamos camparar el objeto uno con el objeto dos 
   * si ambos son undefine entonces retornamos un true djamos marcado 
   * el texto seleccionar una region
   */
  compararRegion(o1:Region , o2:Region):boolean{
    
    if(o1 === undefined && o2===undefined){

      return true; 
    }

    return o1 === null || o2=== null || o1===undefined || o2===undefined ?  false: o1.id===o2.id;


  }

}





//imprimimos
   
    //invocamos el metodo create del service
    //vamos a pasar el objeto cliete y vamos a suscribir
    //a qui irira la respuesta una vez creado el objeto va a crear la respuesta que va 
    //a contener los nuevos datos 
   /*despues el meotdo create se va a conectar al api-rest  y va a percistir el 
    objeto que enviemos a travez de formulario */
