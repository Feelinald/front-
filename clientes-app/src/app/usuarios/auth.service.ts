import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** definimos a qui como atributo de la clase _ por que el guion bajo 
   * por que va hacer un metodo accesor(getter)  para  obtener el usario
   * y este metodo get lo implementamso de una manera espefica  por ejemplo
   * si el atributo usuario existe  y es dsintinto de null entonces vamos
   * a tretornar ese valor  de lo contrario si todavia  si no esta definido
   * lo vamos ir a buscar al sessionstorage entonces _usaurio:Usuario lo 
   * mismo va para el _token:string; -> pero del tipo string.
   * Vamos a implemntar los metodos get siempre son publicos 
   * el nombre es igual que el atributo pro sin el _guinbajo
   * public get usuario():Usuario y que retorna El tipo
   * Usuario pero guntamos si existe el atributo _usuario
   * si  this._usuario es distinto de null  entonces 
   * vamos a retornar entonces el atrubuto this._usuario
   * pero si no esta definido si es null vamos a 
   * pregutnar si existe en el sessionStorage
   * y si existe rotnamos con un sessionStorage ,si es igual a null
   * en el atributo _usuario o si es distinto a null en el sessionStorage.get('usuario')
   * por lo tanto tenemos que convertir el usuario del sessionStorage en un objeto 
   * lo hacemo con la clase JSON y con el metodo parse y guardamos en el atributo 
   * this._usuario = JSON.parse( sessionStorage.getItem('usuario')) as Usuario;
   * y hacemos un cast al tipo usuario  y por ultimo retornamos el atributo this._usuario
   * y que pasa si no existe en ninugna parte?  si el usuario no esta  definido  
   * ni en los atributos  de la clase ni  tampoco existe en la secion 
   * tenemso que retornar un nuevo objeto Uusarios() con todos sus atriburos vacios 
   * sin roles sin username sin password  sin ningun valor oslamente el  obejto
   * retornamos una nueva instancia del usario pero vacio.
   * ¿Como seria el metodo get token?
   * parecido ... solo cambiamos el retorno y  jason porque 
   * this._token=  sessionStorage.getItem('token') -> el parse no va ya que 
   * el token no es un objeto propiamente JSON  sino un string  ;
   * public get token():string "...." 
   * solo retronamos un null -> retornamos un null si no existe.
   * Creamo una nuevo metodo para la autenticacion  isAthenticated() :boolean
   * retorna un booleano    
   * isAthenticated() :boolean -> Este metodo se pone en ingles para hacer
   * rfrencia al que tenemo en el backend y no haya confuciones.
   * Lo primero del metodo   isAthenticated() :boolean -> obtener los datos
   * del token a travez del toekn de acceso entonces a travez de los datos podemos 
   * validar que  usarname exista y tambien que contenga  un string que el 
   * la loongitud del string sea mayor que cero lo (largo) , pero bien 
   * de dnee obtenemos los datos el atrgumento del token lo tenemos que
   * obtener el metodo gettoken() ->  ¿por que ? por que va a pregutnar 
   * va a validar  si el atributo privado  _token existe y si 
   * existe o es distinto de null va retornar el token  y si no esta definido lo
   * va a buscar en el sessionStorage y si lo encuentra  y esta registrado y lo obtenemos
   * desde sesssionStorage por eso es importante el metodo get , ahora con el 
   * el payload preguntamos si el payload es distinto o igual a null oo payload.usar_name si 
   * existe o payload.usar_name.length tiene caracteres si es mayor que cero -> si esto
   * se cuple retornamos un true de lo contratrio un false
   * 
  */
  private _usuario: Usuario;
  
  private _token: string
  /**entonces a qui en le cosntructor lo vamso a inyectar */
  constructor(private http: HttpClient) { }
  
  public get usuario():Usuario{
  
    if(this._usuario != null){

      return this._usuario;
    }else if(this._usuario == null && sessionStorage.getItem('usuario') !=null ){
      
     this._usuario = JSON.parse( sessionStorage.getItem('usuario')) as Usuario;
     
     return this._usuario;

    } 
     return new Usuario();
  }  
  public get token():string{
    if(this._token != null){

      return this._token;
    }else if(this._token == null && sessionStorage.getItem('token') !=null ){
      
      this._token=  sessionStorage.getItem('token') ;
     
     return this._token;

    } 
    return null;
    
  }  

/**Entonces lo primero es crear el metodo login lo que retorna  es la respues ya 
 * sabemos que contieen el token de acceso y todos los datos del json del encpoint
 * cuando nos autenticamso  el refresh token el token de accesoo tambien 
 * la fecha ee aspiracion  datos personalizados lo claims , por lo tanto 
 * el tipo seria un boservable de any de cualqueir tipo  de dato lo  lo sigueinte es
 * retornar la respuesta que vamos a obtener  desde el back end  a travez 
 * de una peticion del tipo httprequest  del tipo post necesitamos  el objeto
 * http client     y a travez del http vamos a retornar this.http.post(y a qui
 * realizamos la peticion, a qui requerimos una urlel endpoint al cual vamos a enviar los datos
 * ) this.http.post<any>(url datos de autenticacion,datos o parametros que vamos a enviar,
 *                       cabeceras http es un arreglo co opciones {arreglo con opciones})
 * pero antes tenemos  que pasar el objeto usuario para poder autenticarnos con el
 * objeto usario, lo siguiente es estas varaibles locales  del metodo  una constante
 * que se define una solar vez y no se vuelve a modificar basicamente
 * apunta al endpoint de springsecurity oauth2  url http://localhost:8080/oauth/token
 * ,lo suigente que necesitamos 
 * son las credenciales en este caso de la aplicacion angular  que seria cliente
 * id angularapp concatenado : + y la clave secreta  no del usario si no del cliente
 *  const credenciales= btoa('angularapp' + ':' + '12345'); pero esto lo tenemos que 
 * encriptar convertir en base 64 en javascript usamsla la funcion btoa(), 
 * y lo sigueinte seria la cabecera  el httoheaders  definimos una constante 
 * y creamos la instancia de HttpHeaders es un objeto con tributos  por lo tanto usamos 
 * las llaves  el atributo el conctentype es muy importante ya que teien que ser del tipo
 * form urlencoded
 *  HttpHeaders({'Content-Type':'application/x-www-form-urlencoded',
 *   'Authorization':'Basic'+ credenciales}) y por ultimo los 
 * parametros que estan deacuerdo al tipo form urlencoded solo creamos
 * una variable local con la clace URLSerachParams();
 *  let params = new URLSerachParams(); 
 * y por utlimo pasamos pasamos parametros con set 
 * paras.set('grant-type','password').
 * Pero antes tenemos que cambiar modificar el params
 * tenemos que convertir params a string el objeto URLSearchParams()
 * con los parametros  por detras lo que hace es generar los parametros 
 * en una urlencoded por lo tanto va a tomar cada parametro y lo va anexar a la url
 * pero tiene que ser del tipo string usamos el metodo .toString()
 * incluso lo podemos mostrar en la consola  http://localhost:8080/oauth/token
 */
  login(usuario: Usuario):  Observable<any>{  

    const urlEndpoint = 'http://localhost:8080/oauth/token';
    
    const credenciales = btoa('angularapp' + ':' + '12345');

    const httpHeaders = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization':  'Basic '+ credenciales
    });
    
    let params = new URLSearchParams();

    params.set('grant_type','password');
          
    params.set('username',usuario.username);

    params.set('password',usuario.password);

    console.log(params.toString());
    
    return this.http.post<any>(urlEndpoint, params.toString(),{  headers: httpHeaders});

  } 
/** implementamos el metodo guardarUsuario() y guardarToken() 
 * guardarUsuario() -> receibe eel acceses token  vamos a 
 * tener dos atributos uno por cada metodo  
 *  solamente cuarda no retorna nada
 * entocnes en el metodo guardarUsuario()
 * seleccionamos _usario = new Usuario()-> cramos una instancia
 * del objeto usario pero le tenemos que pasar los datos 
 * por ejemplo el nombre que lo obtenemso desde el token
 * creamso otro metodo separado que nos entregue los 
 * datos del token  en el metodo obtenerDatosToken():nay_>
 * es de el tipo any y va a retornar el payload del tipo any
 * entocnes dentro del metodo vamos a validar  vamos a 
 * pregutnar que el accessToken sea distinto de null
 * encotnces si es  igual o disntinto de nuell vamos a 
 * retornara JSON.parse(atob(accessToken.split('.')[1]));
 * si fuese null el accessToken  retronamos null y ya
 * tenemso  obtener datos token
 * encotnces en  guardarUsario declaramos el payload = 
 * al metodo this.obtenerDatosToken()-> pasamos accessToken
 *  this._usuario.nombre= payload.nombre; -> seria el payload
 * y a si pasa lor otros datos que vmos a guardar 
 * y que nos queda es guardar el usario en el sessionStorage
 * sessionStorage-> este es un objeto global de javascript que nos
 * permite gurardar  datos en la secion del navegadro parte del api
 * en hml5
 * setItem -> con este metodo vamos a almacenar solo le damos 
 * un nombre le damos un valor no se puede guardar un objeto
 * lo que se puede guardar es un valo de tipo string , pero 
 * podemos convertir nuestro objeto usario en un JSON tipo
 * string un json plano para eso usamos la clase JSON  con el 
 * metodo estatico .JSONstringify hace lo opuesto
 * que el paser el paser  convierte un  string a objeto 
 * jason y stringify convierte   un objeto en un string o texto
 * lo msimo para el meotodo guardarToken(). 
 *  implementamos el metodo logout pa
  */
   guardarUsuario(accessToken:string ):void {

    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.nombre= payload.nombre;
    this._usuario.apellido= payload.apellido;
    this._usuario.email= payload.email;
    this._usuario.username= payload.user_name;
    this._usuario.roles= payload.authorities;
    
    sessionStorage.setItem('usuario',JSON.stringify(this._usuario));

   } 
  
   guardarToken(accessToken:string ):void {

    this._token = accessToken;
    sessionStorage.setItem('token',accessToken);

  } 

  obtenerDatosToken(accessToken:string):any {
      
    if(accessToken !=null ){
      return  JSON.parse(atob(accessToken.split(".")[1])); 
    }
      return null;        


  }


  isAuthenticated():boolean{
    let payload = this.obtenerDatosToken(this.token);
    if(payload !=null && payload.user_name && payload.user_name.length > 0){
        
      return true;

    } 
    return false;

  }
  /**vamos a implementar el metodo hasrole , simplemente vamos a pregutnar 
 * si los roles  del usario contiene  ese nombre de roles nota roles es un 
 * arreglo y los arreglos en javascript contiene  el metodo include que 
 * permite  validar si eiste algun elemento dentrode eses elemento 
 * enctonces si lo contiene retornamos un true , ahora pregutnamos en las 
 * vistas si contieene ese role determinado
 */
  hasRole(role:string):boolean {
    
    if(this.usuario.roles.includes(role)){

      return true ;

    }

      return false;

  }  


  logout():void{
  
  this._token = null;
  this._usuario = null;

  sessionStorage.clear();
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('usuario');
 
}


  }




 
