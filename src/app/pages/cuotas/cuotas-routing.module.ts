
import { LOCALE_ID, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
  {path: 'list', component:ListComponent},
  {path: 'create', component:ManageComponent},
  {path: 'update/:id', component: ManageComponent},
  {path: 'view/:id', component: ManageComponent},
  {path: 'filter/:id', component:ListComponent}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuotasRoutingModule { }
