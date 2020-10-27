import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccessManagerPageRoutingModule } from './access-manager-routing.module';

import { AccessManagerPage } from './access-manager.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccessManagerPageRoutingModule
  ],
  declarations: [AccessManagerPage]
})
export class AccessManagerPageModule {}
