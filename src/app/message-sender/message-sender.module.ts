import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessageSenderPageRoutingModule } from './message-sender-routing.module';

import { MessageSenderPage } from './message-sender.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessageSenderPageRoutingModule
  ],
  declarations: [MessageSenderPage]
})
export class MessageSenderPageModule { }
