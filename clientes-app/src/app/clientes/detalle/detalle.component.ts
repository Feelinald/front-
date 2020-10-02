import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import{ModalService}from './modal.service';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from '../../usuarios/auth.service';
//importamos la clace service ya que tenemos que buscar al lciente por su id
@Component({
  /**la idea es subir una foto por cliente por lo tanto  nececesitamos el id del cliente */
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  
  //etonces a qui estamso inyectando y colocando la inxtancia  del cliente detlles compoenent  
  @Input() cliente:Cliente;
  
  //a la clace de detalle commpoenent vamos a tener un atributo  titulo
  titulo:string =  "Detalle del cliente";
  /*a qui solo tendremos un atributo private ya que es un atributo que solousaremos en la clace
  detalles compoenent  cuando es ne la vista lo dejamos como publico y si lo tenemos en component
  lo dejamos com private
  */
  public fotoSeleccionada: File;  
  public progreso:number = 0; 
  
/**lo sigueinte es inyectarclienteService  via constructor tambien activamos 
 * el activare route ya que lo nececitamos igual como se hacia con el paginador
  para editar un cliente nececitamos este compoenente para poder suscrbir
  cuando cambia le parametro del id */
  constructor(private ClienteServicete: ClienteService,
     public authService:AuthService
    ,public modalService:ModalService  
    ) { }
  ngOnInit(): void {    }
    
    /** en este meotodo llamado desde detallecompoenente seleccionamos la imagen  */
    seleccionarFoto(event){
      this.fotoSeleccionada = event.target.files[0]
       /** y cada que seleccioneos una nueva imagen  tenemos que volver 
        * a reiniciar  el progreso en 0 ya que subiremos una nueva ofoto  indicaremos
        * que prograso es creo
        */
       this.progreso = 0; 
    
      console.log(this.fotoSeleccionada);
       /**lo siguiente es validar que el tipo sea una foto 
        * el atributo type que nos entrega el tipo de archivo
        * si es una imagen del tipo jpg o pgn   
        * indexOf(''):es una metodo  del obejto string que lo que 
        * hace es buscar en el string(cadena) si hay alguna coincidencia
        * con image va a retornar - 1 tenemos que pregutnar si es menor que 0
        * entonces si es negativo no encontro el image 
        * por ultimo borramos y reiniciamos el this.fotoSeleccionada
        */
       if(this.fotoSeleccionada.type.indexOf('image') < 0){
        swal.fire('Error seleccionar imagen ','El archivo debe ser del tipo imagen   ','error');
         //reiniciamos 
         this.fotoSeleccionada = null; 

       }
      

    }
/** vamos crear este metodo simpelemente usando la claceservice y su meotod subir foto 
 * simplemente le pasamos 2 parametro  la foto seleccionada y el id cliente ya tenemos 
 * el atributo cliente con todos sus datos inclueyendo el id y patra finalizar suscribimos
 * y a qui obetenmos el cliente  desde al flujo detnro del boservador  vamos a 
 * suscribir entonces el cambio del cliente con su nueva imagen this.cliente lo actualizamos
 * viene con la foto incluida  y por eso hay que asiganrlo nuevamente  
 * y por ultimo amos un mensaje ocn sweetalert
  */
    subirFoto(){
    
      /**pvalidamos por ejemplo si es distinto a foto seleccionada 
       * lo vamos a menejar si esta todo bien  si seleccionamos  
       * la imagen la subimos al servidor  
      */
      if(!this.fotoSeleccionada){
          
        //mandamos un mensaje de error 
        swal.fire('Error  Upload: ','debe seleccionar una imagen no debe ser  archivo,formato mp3 ni mp4'
        ,'error');
  
      }else{

      this.ClienteServicete.subirFoto(this.fotoSeleccionada,  this.cliente.id).
      subscribe(event =>  {
        // this.cliente =  cliente ;
        if(event.type === HttpEventType.UploadProgress ){
                            //operacion
          this.progreso = Math.round((event.loaded/event.total)*100)

        }else if(event.type === HttpEventType.Response){
          //tomamos el cuerpo del response y lo pasamos a una  varaibles de tipoany response
          //y con esto ya se puede caturar el cliente  
          let response:  any = event.body;
          this.cliente =  response.cliente as Cliente;

          this.modalService.notificarUpload.emit(this.cliente);
          swal.fire('La foto se ha subido completamente !',response.mensaje,'success' ); 
        
        }
        
        
      });
    }
  }
  cerrarModal(){

    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;

  }


  }

/**ActivatedRoute entonces atravez del metodo ngOnInit o evento cuando se inicializa 
 * el comepoenente  vamos a suscribir cando cambia el parametro   del id  para poder 
 * obetener  el detalle  cleinte 
 */


  /* this.activatedRoute.paramMap.subscribe(params =>{
    con el signo +podemos convertir el id+ en un tipo number osea id=+ =>number forma inplicita
        forma explicita: id:number =+ */
   /* let id:number = +params.get('id');*/
    /**si el id existe a travez de la clace service obtenemso al cliente y 
     * lo asignamos al atributo cliente y le pasamos el paramtro y con .suscribe
     * obetenemos el cilente por argumento  y hacemos algo con el 
     * lo vamos  suscribir y pasamos el objeto cliente que tenemos del suscribe 
     * del observable y se lo pasamos al this.cliente a qui hay que implementar
     * la subirda de archivo  dos metodos  uno cuando  se selecciona el aricho
     * y otro cuando se sube  haciendo click en el boton 
     */
/*    if(id){
      this.ClienteServicete.getCliente(id).subscribe(cliente =>{
        this.cliente = cliente;
      });
    } 
 });*/
