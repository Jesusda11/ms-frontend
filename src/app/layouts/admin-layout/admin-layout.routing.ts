import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { AuthenticatedGuard } from 'src/app/guards/authenticated.guard';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { NoAuthenticatedGuard } from 'src/app/guards/no-authenticated.guard';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile', canActivate:[AuthenticatedGuard],  component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    {path: 'login', canActivate:[NoAuthenticatedGuard],  component:LoginComponent},

    {
        path: 'theaters',
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/theaters/theaters.module').then(m => m.TheatersModule)
          }
        ]
      },

      {
        path: 'seats',
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/seats/seats.module').then(m => m.SeatsModule)
          }
        ]
      },

      {
        path: 'categorias',
        canActivate:[AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/categorias/categorias.module').then(m => m.CategoriasModule)
          }
        ]
      },

      {
        path: 'productos',
        //canActivate:[AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/productos/productos.module').then(m => m.ProductosModule)
          }
        ]
      },

      {
        path: 'lotes',
        //canActivate:[AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/lotes/lotes.module').then(m => m.LotesModule)
          }
        ]
      },

      {
        path: 'empresas',
        //canActivate:[AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/empresas/empresas.module').then(m => m.EmpresasModule)
          }
        ]
      },

      {
        path: 'conductores',
        //canActivate:[AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/conductores/conductores.module').then(m => m.ConductoresModule)
          }
        ]
      },

      {
        path: 'turnos',
        //canActivate:[AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/turnos/turnos.module').then(m => m.TurnosModule)
          }
        ]
      },

      {
        path: 'duenios',
        //canActivate:[AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/duenios/duenios.module').then(m => m.DueniosModule)
          }
        ]
      },

      {
        path: 'vehiculos',
        //canActivate:[AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/vehiculos/vehiculos.module').then(m => m.VehiculosModule)
          }
        ]
      },

      {
        path: 'dueniovehiculos',
        //canActivate:[AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/dueniovehiculos/dueniovehiculos.module').then(m => m.DueniovehiculosModule)
          }
        ]
      },

      {
        path: 'vehiculoconductores',
        //canActivate:[AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/vehiculoconductores/vehiculoconductores.module').then(m => m.VehiculoconductoresModule)
          }
        ]
      },

      {
        path: 'contratos',
        //canActivate:[AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/contratos/contratos.module').then(m => m.ContratosModule)
          }
        ]
      },

      {
        path: 'rutas',
        //canActivate:[AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/rutas/rutas.module').then(m => m.RutasModule)
          }
        ]
      },

      {
        path: 'cuotas',
        //canActivate:[AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/cuotas/cuotas.module').then(m => m.CuotasModule)
          }
        ]
      },

      {
        path: 'direcciones',
        //canActivate:[AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/direcciones/direcciones.module').then(m => m.DireccionesModule)
          }
        ]
      },

      {
        path: 'direccionrutas',
        //canActivate:[AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/direccionrutas/direccionrutas.module').then(m => m.DireccionrutasModule)
          }
        ]
      },

      {
        path: 'clientes',
        canActivate:[AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/clientes/clientes.module').then(m => m.ClientesModule)
          }
        ]
      },

      {
        path: 'personanaturales',
        //canActivate:[AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/personanaturales/personanaturales.module').then(m => m.PersonanaturalesModule)
          }
        ]
      },

      {
        path: 'facturas',
        //canActivate:[AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/facturas/facturas.module').then(m => m.FacturasModule)
          }
        ]
      },

      {
        path: 'gastos',
        //canActivate:[AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/gastos/gastos.module').then(m => m.GastosModule)
          }
        ]
      },
      {
        path: 'servicios',
        //canActivate:[AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/servicios/servicios.module').then(m => m.ServiciosModule)
          }
        ]
      },
      {
        path: 'administradores',
        //canActivate:[AuthenticatedGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/administradores/administradores.module').then(m => m.AdministradoresModule)
          }
        ]
      },
      /* AUTO-ROUTES */
];
