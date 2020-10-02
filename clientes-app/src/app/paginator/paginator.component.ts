import { Component, OnInit,Input, OnChanges,  SimpleChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html',

})
export class PaginatorComponent implements OnInit ,OnChanges {
  @Input() paginador:any;
  
  paginas: number[];
  //partimos desde el atributo
  desde:number;
  hasta:number;

  constructor() { }
  

/* se puede dejar mas optimizado y con mas detalle por ejemplo podriamso hcer 
  el calculo el rango las paginas en el el OnInit pero solamente para la priemra
  pagina  cunando se crea el clliente componenet y tambien   el paginato componen 
  lo que cambia es el paginador co nel contenigo por eso se uso el meotod
  ngOnchange por que oGoninit solo se puede ejecutar una sola vez pero 
  si se puede ejecutar el ngOngChange para ejecutar los cambios del paginador en los 
  nuevos rangos para que se muestre en forma correcta  en la vista la idea es que 
  en el oninit calcukamos el rango solamente para la primera pagina y posteriormente en 
  las siguntes pagians recalculamos el rango  de las paginas en el meotodo ngOnchange
  lo primero es crear un metodo con el calculo de los rangos para que se pueda utilizar tanto 
  en el onInit como  ngOnChange*/
  ngOnInit(): void {

    //lo vamos a llamar a qui para cuando se inizilize el compoenet
    this.initPaginator();

  }
/** luego en el ngOnchange podemos tener la version de este metodo  cone le parametro changes
 * que son del tipo simple changes,entonces a través de los changes podemos obtener el cambio
 * del inputo del objeto paginardor  que no esta inyectando el componenete padre
 */
  ngOnChanges(changes: SimpleChanges): void{
    let paginadorAtuaclizado = changes ['paginador'];
    //preguntamos  si paginador actualizado tiene alguna version anterior solamente si tiene un estaod anterior haya cambiado
    //invocamos el initPaginator  
    if(paginadorAtuaclizado.previousValue){

      this.initPaginator();

    }
    


   
    /**usamos el meotodo fill() para llenar el arreglo de datos
     * luego usamos el map para modificar los datos los ceros 
     * con los numeros de pagina*/   
/** clacularemos estoes rangos solo cuando la totalidad de las paginas el totalpage 
 * sea mayor que 5  si no lo dejmos como estaba*/


  
  }
  private initPaginator():void{
  
    this.desde =  Math.min(  Math.max(1,  this.paginador.number-4),  this.paginador.totalPages-5);
    this.hasta =  Math.max(Math.min(this.paginador.totalPages,  this.paginador.number+4),6);
  
   if(this.paginador.totalPages>5){
      
    this.paginas = new Array(this.hasta - this.desde + 1).fill(0).map((_valor,  indice) => indice + this.desde);
  
    }else{
      this.paginas = new Array(this.paginador.totalPages).fill(0).map((_valor, indice) => indice + 1);      
    }
  



  }





}
