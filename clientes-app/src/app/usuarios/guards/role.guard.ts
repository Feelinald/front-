import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree,Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
/** entonces lo primero es inyectar lo mismo que teneiamos 
 * en la otra clase la clase authService y el objeto router
 * y ademas el sweetalert para dar un mensaje no tienes 
 * accesos a este recurso por ejemplo ,
 * Lo primero es obtener el  role que vams a pasar por argumenteo 
 * podemos pasar parametros a nuestro guard y obtener  estos 
 * parametros en este casp para validar el role  
 * por ejemplo podemos validar una ruta que sea solamente para
 * validar el role  admin otra ruta que sea para user 
 * y otra para cualquier role,
 * obtenemos el role el cual vamos a validar a travez del
 * objeto  next: ActivatedRouteSnapshot  que recibimos como
 * argumento en el metodo canActivate
 * let role = next.data['role'] as string; -> .data : conteiene
 * una arreglo con los parametros data['role']::role y el tipo 
 * de datos que retorna es del tipo data  a si que lo podemos 
 * con vertir a una strng as string: es un cast una convercion
 * ahora validamos este role,
 * si  tiene rola this.authService.hasRole(role)
 * retornamos un tuee  de lo coontrario false pero ademas
 * si es falso si no cumple tenesmo que enviar  un mensaje 
 * y redirigir al listado clientes y mostramso en 
 * consolar el role , pero tambien es importante 
 * que nuestro role este autenticado   tal como lo hace 
 * en e l authguardo ponerlo antes de pregutnar por el role
 * pregutnar si estamos autenticados !this.authService.isAuthenticated( )->
 * entonces de esta forma primero validamso  si no esta autentcado
 * y si no esta nos salimos  y redirigimos al login y to olo relacionado
 * al role no e ejecuta ni valida , pero si estamso autenticados ahiti validamos  
 */
export class RoleGuard implements CanActivate {
  constructor(private authService:AuthService, private router:Router){} 
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(!this.authService.isAuthenticated( )){
        
        this.router.navigate(['/login']);
        return false;
  
      } 
      

      let role = next.data['role'] as string;
      console.log(role)
      if(this.authService.hasRole(role)){
          
        return true;

      }
      swal.fire('Acceso denegado',`Lociento ${this.authService.usuario.username} no tienes acceso`,'warning')
     this.router.navigate(['/clientes']);
      return false;
  }
  
}
