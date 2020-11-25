import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoothAgentsPagePageRoutingModule } from './booth-agents-page-routing.module';

import { BoothAgentsPagePage } from './booth-agents-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BoothAgentsPagePageRoutingModule
  ],
  declarations: [BoothAgentsPagePage]
})
export class BoothAgentsPagePageModule {}
