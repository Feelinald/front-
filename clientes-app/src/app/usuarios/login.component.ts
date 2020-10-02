import { Component, OnInit } from '@angular/core';
import{Usuario} from './usuario'
import swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
/**lo sigueitne es crear un titulo , lo siguiente 
 * es crear una ruta para este compoenente paraque se pueda 
 * acceder una url para nuestra aplicaicon con angular
*/

export class LoginComponent implements OnInit {

  titulo:string = 'Por favor inicie secion!';  
  usuario:Usuario;
/** dentro del constructo vamos a inicializar el bojeto usuario.
 * Inyectamos las clases 
 */
  constructor(private authService:AuthService, private router:Router) { 
    this.usuario= new  Usuario();

  }
/**vamos a preguntar  si el usario esta autenticado y a qui  implmentamos 
 * a autenicacion encontces si es ta autenticado this.authService.isAuthenticated()
 * nos vamos a dirigir a la pagina clientes a la pagina por defecto 
 */
  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      
       swal.fire('Login',`Hola ${this.authService.usuario.username} ya estas autenticado`,'info'); 
       this.router.navigate(['/clientes']); 

    }
  }
  /**vamos a tener el metodo login ,tambien nececitamos el atributo del usuario .
   * Con AuthService  iniciamos secion recordemos que como es un atributo 
   * es con this.authService.login(tenemos que pasar el objeto usario).suscribe()
   * y como todo observable tenesmo que suscribirnos  suscribir un
   * objeservador que va a realizar  alguan tarea  que va a realizar alguana
   * tarea ara  manejar una respuesta  el token enconces
   * con  subscibe(response => { }) lo que haremos es mostrar en la consolar  en la 
   * respuesta pa ver que estamos obeteniendo
   * invocamos el atributo access token.
   * split: es convertir  el string accses_token  en un arreglo
   *  y cada elemento  del arreglo corrsponde a una 
   * seccion o contenido del token que estan peraadas por un punto lo 
   * que nos interesa es el payload por eso separamos por punto por 
   * eso convertimos este string a travez de los puntos donde el elemento cero
   * seria el header , el elemento uno seriael payload =  datos y el elemento 
   * dos seria la firma  y ¿como podemos obetenr el usarname?
   * pues  decodificando este string  que esta en base 64 esta encriptado
   * por lo tanto usanso la puncion JavaScript atob()-> pordemos 
   * convertir en nuestro json  una vez ya convertidos pero a un 
   * es del tipo string no es un objeto o un json tenemso que parsear
   * (analizar) este string  y convertirlo a un JSON (objeto) 
   * utlizano la clase JSON y su metodo estatico parse
   * let payload =JSON.parse(atob(response.access_token.split('.')[1]))
   * y pasamos  payload en el log
   * dentro de suscribe invocamos otro console.log(payload)
   * y podemos obetener el user_name a travez del payloadpayload.
   * la idea de esta clace type script es guardar los datos del usario
   *  y tambien  guardar el token en el sessionstorage 
   * creamos dos metodo en authservice entonces en suscribe vamos 
   * a guardarUsuario   el token y el usario
   * guardarUsuario() -> a qui por argumento guardamos el usario }ya que 
   * nuestro token contiene todos los datos del usario, 
   * guardarToken() -> y muy parecido guardarToken tambien pasamos el access_token.
   *  ya no nececitamos ocupar ya que lo estamos manejando en la clase service  por lo 
   * tanto se puede quitar   
   * let payload = JSON.parse(atob(response.access_token.split('.')[1]));  ${payload.user_name} console.log(payload);
   * pero no s marca un error por lo tanto implemntamos el metodo get para obetener 
   *  el usario ya que lo podemos oupar cuando estemos  autenticados todos los datos del usario.
   * En le obeservable en el metodo suscribe manejaremos un status 400 para hacerlo mas
   * amigable para el usuario despues de response con un coma podemos manejar el error 
   * encotnce  con err => manejamos un if que el status el codigo sea 400 de validacion
   * 
   */
  login():void {
    //a qui cada que iniciemos secion mostramos datos del usario
    console.log(this.usuario);
    //tambien podramos validar tambien que el username y el password sean distintos de null 
    //si estan vacios los  campos mostramos un mensaje de error con sweetalert
    if(this.usuario.username == null  || this.usuario.password == null){
       
      swal.fire('Error Login ','Username o password vacios!','error');

      //encontces nos salimos 
      return ;

    }
    this.authService.login(this.usuario).subscribe(response =>{
        
      console.log(response);
      //let payload = JSON.parse(atob(response.access_token.split('.')[1]));  ${payload.user_name} console.log(payload);
      
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      let usuario = this.authService.usuario;
      this.router.navigate(['/clientes']);
      swal.fire('Login',`Bienvenido ${usuario.username},Has iniciado secion correctamente!`,'success')
      
    },err =>{
        if(err.status == 400){
      
          swal.fire('Error Login ','Usuario o clave incorrecta!...','error');
   

        }

    });

  }

}
