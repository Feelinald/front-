/*A qui tenmos  a todos los accesos a  nuestros endpoint del back-end con distintas operaciones
todo esto lo tenemos que retringir el codigo de error un true o false
si ocurre este erorr con el status 401  o 403*/ 
import { Injectable } from '@angular/core';
import{formatDate,DatePipe }from '@angular/common';//importaremos formatdate que se incluye  en angular 9.0.7
import { Cliente } from './cliente';
import  { of,Observable,throwError, observable } from 'rxjs';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http'
import { HeaderComponent } from '../header/header.component';
import{map,catchError,tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { Region } from './region';
import { AuthService } from '../usuarios/auth.service';
@Injectable() 
export class ClienteService {
//este aoperador se encarga de intersepar el bosebavle lo intersepta en busca de fallas 
//definimos url como un atributo de clase 
/**Hay que entender que el el objto httpHeaders es inmutable , por lo tanto 
 * cada vez que  agrgamos un atributo con el metodo apen es retornar una nueva
 * instancia pero la instancia original se mantiene inalterable e inmutable por lotanto
 * tenemmos que  implementar un metodo en las cabeceras que se llame authorization
 * y retorne esta nueva instancia  y es la que usaremos en cada
 * una de la nueva instancia y es la que vamos a usar 
 * en cada una de las peiciones   en los endpoint , encontces en l constructor 
 * inyectamos el authServices:authServices -> del tipo authServices
 *  Content-type 
 */
  private urlEndPoint:string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({'Content-type': 'application/json' })

  constructor(private http: HttpClient, private router:  Router,
  private authService:AuthService ) { }
  /**creamo el metodo hearder -> de cabecera.
   * 1. tenmos que obtener el token pero el token lo obtenemos a travez
   * del authoservice tenemos que obtener el authservice para inyectar 
   * ingrasar y obetener el toke que tenemso que guardado , en este 
   * metodo obetenemos el token, pregutnamos is el token es distinto o 
   * igual a null y si es igual o distinto de null agregamos en las cabeceras
   * por lo tanto retornamos this.httpHeaders.append;
   */
  
  private agregarAuthorizationHeaders(){
      
    let  token  = this.authService.token;
    
    if(token != null){
      
      return this.httpHeaders.append('Authorization',  'Bearer ' + token);
  
    }
     return this.httpHeaders; 

  }
  /*un metodo de la clase is no autorizado
  *va a retornar entones un booleano y como argumento va a recibir el error*/
  private isNoAutorizado(e):boolean {
   /**entonces pregutnamos si el error.status = 401
    * 401 -> es no autorizado mientras que el 403-> es 
    * Forbidden recurso prohibido */ 

   if(e.status == 401 ){
    /*y a qui retornamos true es decir que no esta autorizado   
    pero ademos tenemos que regdirigir a la pagina del login
    entonces utilizando el metodo  router.navigate(['pasamosla/ruta'])*/
    
    if(this.authService.isAuthenticated()){
      
      this.authService.logout();
    }


    this.router.navigate(['/login']);
    return true;
   }
   if(e.status == 403){
    /*y a qui retornamos true es decir que no esta autorizado   
    pero ademos tenemos que regdirigir a la pagina del login
    entonces utilizando el metodo  router.navigate(['pasamosla/ruta'])*/
    swal.fire('Acceso denegado',`Lociento ${this.authService.usuario.username} no tienes acceso`,'warning')
     this.router.navigate(['/clientes']);
    return true;
   }

     return false;

  } 

  /** manejamos los permisos de admin para cada metodo con la diferencia de que ahora
   * llamamos el metodo que acabamos de crear 
   */

  getRegiones(): Observable<Region[]>{
    //esta es la ruta para retonar el liestado region en formato json como un observable
    /**usando pipe utilizamos el catchError 
     * en este caso solo invocamos el metodo this.isNoAutorizado(e);
     * y retornamos el error con throwError(e)
    */
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones' ,
    {headers: this.agregarAuthorizationHeaders()}).pipe(
      catchError(e=>{
         this.isNoAutorizado(e);
         return throwError(e);
      })
    );
  }

/*a qui no va el metodo or que es para mostrar el listado y de accesos publico*/ 
  getClientes(page: number):Observable<any>{

      //El metodo pipe nos permite agregar mas operadores
    return this.http.get(this.urlEndPoint+'/page/'+ page).pipe(
      //En resumen se toma la respuesta que viene en un formato json 
      //el tipo de datos de dato generico es un tipo any 
      // y a qui tomamos esta variable response lo convertimos a un listado 
      //la funcion que parece una flecha es usado para crear funciones anonimas
      //arrow function 
      /*map_cinvierte del tipo object tipo dato base a un tipo cliente corchete 
      let: es parte del lenguaje emac scrip 6 que permite definir dentro 
      de una variable local, recordemos que el objeto map tienes 
      que retornar el objeto mmodificado vamos a retornar modificando sus valores
      para ello tenemos que modificar o utilizar el metodo map tambien pero en 
      este caso es el metodo map del arreglo clientes*/ 
      
      /*entonces para resumir  el primer return s par el map de clientes
      y el segundo es para  el operador map del flujo 
      forEach: no toca los valores simplemente va mostrando datos*/
      
      tap((response: any) => {

        
        console.log('Cli  enteService: tap1'); 
        (response.content  as Cliente[]).forEach( cliente => {

          console.log(cliente.nombre);
        }

        )
      }),
      //vamos a retornar el response que teien el arreglo clientes tambien va a contener los otros parametros
      map( (response : any) => {
        
         (response.content as Cliente[]).map(cliente => {
              cliente.nombre =  cliente.nombre.toUpperCase();
              //creamos instancia   
              let datePipe =  new DatePipe('es-MX'); 
              //cliente.createAt = datePipe.transform(cliente.createAt,' dd/MMMM/yyyy'); //formatDate(cliente.createAt,'dd-MM-yyyy','en-Us');
              return cliente;  
          });
          return response;
        } ),
        tap(response => {
          console.log('ClienteService: tap2');
          (response.content as Cliente[]).forEach( cliente => {
  
            console.log(cliente.nombre);
          }
  
          )
        }),
  
  
    
      );
  }

//implementamos el metodo create que va recibir el objeto cliente json
/** implementamos el metodo */

  create(cliente: Cliente):Observable<Cliente> {
    /*va a retornar el nuvo cliente que se quedo en el servidor*/
    //map(  (response : any) => response.cliente as Cliente),
/*a qui hay que pregutnar si el error del status es 400 = badrequest*/
    return this.http.post(this.urlEndPoint, cliente, {headers: this.agregarAuthorizationHeaders()})
    .pipe(
      map((response:any) => response.cliente as Cliente),
      catchError(e  => {
        /*tenemos que preguntar si es 400 viene de la validacion retpornamos el error
        para que el componenete se envargue de manejar este error en el metodo suscribe
        capturamos el error y pasamos estos errores a la platilla*/
       /**ya que a qui esta manejando errores por ejemplo para validar 
        * de cualquie tipo que maneja en el backend debemos tener un if con 
        * el metodo isNoAutorizado(e) retornamos un throws(e) por lo 
        * tanto si es tru retorna un 401 o 403 ya que detectamos que 
        * no tenemos autorizacionpara los demas recursos
        */
         if(this.isNoAutorizado(e)){
           
          return throwError(e);
         
          
         }
        if(e.status == 400) {
          return throwError(e);
         }

        
         console.error(e.error.mensaje);
         swal.fire(e.error.mensaje,e.error.error,'error');
         return throwError(e);
      })
    );  
  }


  getCliente(id: any):Observable<Cliente>{
  
    //signo String con las comillas invertidad  son de interpolacion nunca olvidar el tipo de retrono
    //usaremos catcherror  
  
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`,
    {headers: this.agregarAuthorizationHeaders()}).pipe(
      catchError(e  =>{
        
        if(this.isNoAutorizado(e)){
           
          return throwError(e);
         
          
         }
       
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal.fire('Error al editar',e.error.mensaje, 'error')
        return throwError(e);
      })
    );


  }

update(cliente: Cliente):Observable<any>{  

  return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente,
  {headers: this.agregarAuthorizationHeaders()})
  .pipe(   catchError(e  => {

      if(this.isNoAutorizado(e)){
           
        return throwError(e);
       
        
       }

      if(e.status==400) {
        return throwError(e);
       }
      console.error(e.error.mensaje);
      swal.fire(e.error.mensaje,e.error.error,'error');
      return throwError(e);
   })
  );

}

  delete(id: number): Observable<Cliente>{

    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,
    {headers: this.agregarAuthorizationHeaders()}).pipe(
      catchError(e  => {

        if(this.isNoAutorizado(e)){
           
          return throwError(e);
         
          
         }
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
     })

      );
  } 
  /** creamos nuestro emotod para subir la foto en el backend utilizando nuestra
   * api-rest pero tenemos que encviar utilizando FormData con sorporte multipart/form-data(enctype)
   * para eso tenemoes que usar la clace de java script formData:esta es una clace de javascript
   * que es nativa  por lo tanto no se tiene  que importar solo la utilizamos
   * formData.append("tiene que coincidir con lo que pisimos en ",back end simepre);
   * entonces en vez de enviar el cliente como lo estabamos haciendo  en create.editar o update
   * a qui enciavmos el formData y a qui tenemos que manejar el obnsebable 
   * del tipo cliente para poder obetener  el cliente modificado con la foto la nueva foto 
   * y poder mostrar esta foto entonces para convertir nuestro flujo para que sea el tipo cliente
   * entonces utlizamos el pipe  y dentro del pipe el operador map y tambien manejar el error
   * con catchError en el map se va a eimitir un respone con json
   * por lo tanto siemrpe recordar que estamos accediendo a este atributo cliente que retorna un json
   * para convertir un obeserbable de cliente			   
   * ----------------------------------------------------
   * subireos la foto con una barra de progreso para aumentar 
   * la experiencia del usario 
   * A qui para el admin estamos mandando un formdata y no un app json por lo tanto a qui 
   * crearemos una nueva isntancia completamente separada de httpHeaders
   * creamos un atributo httpHears y creamos el objeto 
   * 
   */
   subirFoto(archivo: File, id):Observable<HttpEvent<{}>>{
    
      let formData = new FormData();

      formData.append("archivo",  archivo);
      formData.append("id",  id);
      
      let httpHeaders = new HttpHeaders();
       
      let token = this.authService.token;

      if(token !=null){

       httpHeaders  = httpHeaders.append('Authorization', 'Bearer ' + token);
      }
        
      const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
        reportProgress: true,
        headers: httpHeaders
      });
    //etonces a qui en eel request pasamos el request
    /** y todo esto del ipe lo pdemos quitar  ya que en vez de retornar
     * un boservable cliente vamos a retornar un event  con el prograso  */ 
      return this.http.request(req).pipe(
       catchError(e => {
         this.isNoAutorizado(e);
         
         return throwError(e); 
        })
      );

    
  
    }
  /*
    Metodo pipe subri foto 
    .pipe(
        map((response : any) =>  response.cliente as  Cliente),
        catchError(e  => {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje,e.error.error,'error');
          return throwError(e);
       })
      )
  
  
  
  */ 
 
  //creamos un metodo para utilizar la inyeccion de dependencias
 
  //una forma
  /* getClientes():Observable<Cliente[]>{

    //el objeto http y el metodo get  siempre va a restornar un objeto del tipo observable 
    //por lo tanto de la promesa en el cuerpo de la resputa va a devolver un tipo json 
    //justo con esto hacemos un cast 
    return this.http.get<Cliente[]>(this.urlEndPoint)
    
    //Nota cuando sea un metodo siemrpe retrona en mayusculas 
   // return of(CLIENTES);

  }*/


}
