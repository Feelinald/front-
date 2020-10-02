import {Component  } from "@angular/core";
import { AuthService } from '../usuarios/auth.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({

  selector :'app-header',
  templateUrl: './header.component.html'

})
/** en esta clase tenemos que inyectar la clase servicio authService  y tambien 
 * en la vista tenemso que ocultar el boton  cuando este autenticado,
 * implementamos el constructor
 */
export class HeaderComponent {
 title:string = 'Api-rest'
  constructor(public authService:AuthService,private router:Router){}

/**creamos otro metodo para salir de la secion logout():void */

 logout():void{
    
    let username = this.authService.usuario.username;
   
    this.authService.logout();
   
    swal.fire('Logout' ,`${username}, has cerrado sesion corretamente!`,'success');
     
    this.router.navigate(['/login']);
 
  } 



}
