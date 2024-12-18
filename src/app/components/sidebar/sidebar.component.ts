import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { SecurityService } from 'src/app/services/security.service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    type:number // 0 --> No esta logueado, se  pone si no esta logueado //1 --> Si está logueado // 2 --> No importa
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '', type:2},
    { path: '/icons', title: 'Icons',  icon:'ni-planet text-blue', class: '', type:2 },
    { path: '/maps', title: 'Maps',  icon:'ni-pin-3 text-orange', class: '' , type:2},
    { path: '/user-profile', title: 'User profile',  icon:'ni-single-02 text-yellow', class: '', type:1  },
    { path: '/tables', title: 'Tables',  icon:'ni-bullet-list-67 text-red', class: '', type:1  },
    { path: '/login', title: 'Login',  icon:'ni-key-25 text-info', class: '', type:0},
    { path: '/register', title: 'Register',  icon:'ni-circle-08 text-pink', class: '',type:0 },
    {path: '/productos/list', title: 'Productos', icon: 'ni-box-2 text-blue', class: '', type: 1}, // Caja para representar productos
{path: '/administradores/list', title: 'Administradores', icon: 'ni-single-02 text-purple', class: '', type: 1}, // Icono de persona administrativa
{path: '/clientes/list', title: 'Clientes', icon: 'ni-circle-08 text-green', class: '', type: 1}, // Icono de usuarios/clientes
{path: '/conductores/list', title: 'Conductores', icon: 'ni-delivery-fast text-orange', class: '', type: 1}, // Icono de transporte/vehículo
{path: '/contratos/list', title: 'Contratos', icon: 'ni-paper-diploma text-red', class: '', type: 1}, // Icono de documento o contrato
{path: '/cuotas/list', title: 'Cuotas', icon: 'ni-money-coins text-yellow', class: '', type: 1}, // Icono de dinero o pagos
{path: '/direcciones/list', title: 'Direcciones', icon: 'ni-compass-04 text-cyan', class: '', type: 1}, // Icono de brújula para ubicaciones
{path: '/direccionrutas/list', title: 'Direccion x Ruta', icon: 'ni-compass-04 text-pink', class: '', type: 1}, // Icono de mapa para rutas
{path: '/duenios/list', title: 'Dueños', icon: 'ni-single-02 text-teal', class: '', type: 1}, // Icono de propietarios o empresa
{path: '/dueniovehiculos/list', title: 'Dueños x Vehiculos', icon: 'ni-bus-front-12 text-brown', class: '', type: 1}, // Vehículo y dueños relacionados
{path: '/facturas/list', title: 'Facturas', icon: 'ni-credit-card text-green', class: '', type: 1}, // Icono de tarjeta o factura
{path: '/gastos/list', title: 'Gastos', icon: 'ni-chart-bar-32 text-red', class: '', type: 1}, // Icono de gráficos para gastos
{path: '/lotes/list', title: 'Lotes', icon: 'ni-archive-2 text-indigo', class: '', type: 1}, // Icono de almacenamiento
{path: '/personanaturales/list', title: 'Personas naturales', icon: 'ni-single-02 text-blue', class: '', type: 1}, // Persona individual
{path: '/rutas/list', title: 'Rutas', icon: 'ni-pin-3 text-orange', class: '', type: 1}, // Icono de un pin en el mapa
{path: '/servicios/list', title: 'Servicios', icon: 'ni-settings-gear-65 text-violet', class: '', type: 1}, // Icono de engranaje para servicios
{path: '/vehiculos/list', title: 'Vehiculos', icon: 'ni-bus-front-12 text-yellow', class: '', type: 1}, // Icono de transporte
{path: '/vehiculoconductores/list', title: 'Vehiculo x Conductores', icon: 'ni-delivery-fast text-pink', class: '', type: 1} // Icono de transporte asignado

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  theUser:User;
  subscription:Subscription;
  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router, private securityService:SecurityService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });

   this.subscription = this.securityService.getUser().subscribe(data =>{
    this.theUser = data;
   })
  }

  getTheSecurityService(){
    return this.securityService;
  }
}
