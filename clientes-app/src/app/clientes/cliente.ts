import { Region } from './region';

//base en formato js
/*a qui exportamos los atributso a qui usaremos todos los atributos de la clase  que tambien 
se traducen a los campos de formaulario y tambien  el backend a nuestra clase entity 
por lo tanot tenemos que ageegar e atributo region es de ltipo de la clase region  que 
tenemos que crear  para usar la clase region tenemos que agregar el atributo del ipo region,
entonces estamos replicando lo que tenemos en el backend  la clase enitity que forma parte de 
la clase enttty*/ 
export class Cliente {

    id:number;        
    nombre :string;
    apellido :string;
    createAt:string;
    email:string;
    foto:string;
    region:Region; 

}
