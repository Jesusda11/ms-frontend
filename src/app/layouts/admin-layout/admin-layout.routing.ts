import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },

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
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/categorias/categorias.module').then(m => m.CategoriasModule)
          }
        ]
      },

      {
        path: 'productos',
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/productos/productos.module').then(m => m.ProductosModule)
          }
        ]
      },

      {
        path: 'lotes',
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/lotes/lotes.module').then(m => m.LotesModule)
          }
        ]
      },

      {
        path: 'empresas',
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/empresas/empresas.module').then(m => m.EmpresasModule)
          }
        ]
      },

      {
        path: 'conductores',
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/conductores/conductores.module').then(m => m.ConductoresModule)
          }
        ]
      },

      {
        path: 'turnos',
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/turnos/turnos.module').then(m => m.TurnosModule)
          }
        ]
      },

      {
        path: 'duenios',
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/duenios/duenios.module').then(m => m.DueniosModule)
          }
        ]
      },

      {
        path: 'vehiculos',
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/vehiculos/vehiculos.module').then(m => m.VehiculosModule)
          }
        ]
      },

      {
        path: 'dueniovehiculos',
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/dueniovehiculos/dueniovehiculos.module').then(m => m.DueniovehiculosModule)
          }
        ]
      },

      {
        path: 'vehiculoconductores',
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/vehiculoconductores/vehiculoconductores.module').then(m => m.VehiculoconductoresModule)
          }
        ]
      },

      {
        path: 'contratos',
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/contratos/contratos.module').then(m => m.ContratosModule)
          }
        ]
      },

      {
        path: 'rutas',
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/rutas/rutas.module').then(m => m.RutasModule)
          }
        ]
      },

      {
        path: 'cuotas',
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/pages/cuotas/cuotas.module').then(m => m.CuotasModule)
          }
        ]
      },

      
];
