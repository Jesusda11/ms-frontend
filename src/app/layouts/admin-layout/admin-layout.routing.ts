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

];
