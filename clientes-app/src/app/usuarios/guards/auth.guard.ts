import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
/**esta clase implementa la interface CanActivate 
 * encontec cuando en la interface canActivate
 * se retorna un true sea un booleano  o una promeso o
 * un boservable del tipo boolean cuando es true 
 * va dejar pasar a la ruta al compoenete vamos a 
 * redirigir a la pagina login vamos a inyectar el authoservice
 * enconces creamos el constructor de esta clase para inyectar 
 * el authservice, con this pregutamos siestamos autenticados
 * con this.authService this _> se usa cada que es atributo de la 
 * clase  pregutnamos si estamos autenticados con authSerivice
 * si si estaos autenticados retornamos true
 * de lo contrario retornamos un false   
 * pero ademas abria que redirigir a la pagina login 
 * pero para eso tambien inyectamos el objeto route.  
 * Antes de obtener el compoenete obetenemos los datos  el pay load
 *  en el payload vamos a tener la fecha  del expeiracion que esta
 * en segundos pro lo tanto ahi podemos validar nuestra fecha actual
 * convertida en segudnos  y ver si es menos o mayor que la fecha 
 * de expiracion del toke de esa forma  sabemso si el token es valido o 
 * expiro .
 * 1. Creamo un metodo llamado isTokenExpirado():boolean -> retorna un booleano
 * lo primoer es obtener el token 
 *     let token = this.authService.token; -> lo primero es que invoca el metodo get
 *     del token.
 *     let payload = this.authService.obtenerDatosToken(token);-> y invocamos 
 *     obtener datos del token  y a qui tenesmo que pasr el token como argumento
 *     let now = new Date().getTime()/1000 -> obtenemos lafecha actual convertida en
 *     segundo  y le invoamos el metodo getTime(): a qui obtenemso la fecha en 
 *     mili segudnos  y para llevarlos a segundos dividimos entre 1000
 *     ahora com paramos si la fecha del payload.exp  de expiracion es menor a la fecha acutal
 *     entocnes retornamos true  es decir el token exipro  de lo controario retornamos false
 *     payload.exp-> es de expiracion .
 * 2. Entonces dentro del this.isTokenExpirado() condicionamos de nuevo 
 *    si this.isTokenExpirado() exipra  vamos a cerrara la secion 
 *    y vamos a retornar un false y esta seria la forma de validar en guard 
       


 */
export class AuthGuard implements CanActivate {

 constructor(private authService:AuthService, private router:Router){} 
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if(this.authService.isAuthenticated( )){
       
      if(this.isTokenExpirado()){
          
        this.authService.logout();
        this.router.navigate(['/login']);
        return false;
      }
      return true;

    } 
      this.router.navigate(['/login']);
      return false;

  }
  isTokenExpirado():boolean{
   
    let token = this.authService.token;
    let payload = this.authService.obtenerDatosToken(token);
    let now = new Date().getTime()/1000

    if(payload.exp <= now ){

      return true;
    }
      return false ;

  }
  
  
}
