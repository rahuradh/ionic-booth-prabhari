import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccessPagePageRoutingModule } from './access-page-routing.module';

import { AccessPagePage } from './access-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccessPagePageRoutingModule
  ],
  declarations: [AccessPagePage]
})
export class AccessPagePageModule {}
