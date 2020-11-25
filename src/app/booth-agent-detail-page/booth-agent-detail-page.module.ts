import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoothAgentDetailPagePageRoutingModule } from './booth-agent-detail-page-routing.module';

import { BoothAgentDetailPagePage } from './booth-agent-detail-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BoothAgentDetailPagePageRoutingModule
  ],
  declarations: [BoothAgentDetailPagePage]
})
export class BoothAgentDetailPagePageModule {}
