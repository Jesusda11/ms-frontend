import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeatsRoutingModule } from './seats-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';


@NgModule({
  declarations: [
    ListComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    SeatsRoutingModule
  ]
})
export class SeatsModule { }
