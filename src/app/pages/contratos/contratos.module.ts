
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContratosRoutingModule } from './contratos-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    ContratosRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ContratosModule { }
