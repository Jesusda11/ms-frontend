import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ManageComponent } from './manage/manage.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ManageComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule
  ]
})
export class ChatModule { }
