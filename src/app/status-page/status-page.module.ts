import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatusPagePageRoutingModule } from './status-page-routing.module';

import { StatusPagePage } from './status-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatusPagePageRoutingModule
  ],
  declarations: [StatusPagePage]
})
export class StatusPagePageModule {}
