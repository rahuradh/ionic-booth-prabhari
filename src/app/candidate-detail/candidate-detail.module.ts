import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateDetailPageRoutingModule } from './candidate-detail-routing.module';

import { CandidateDetailPage } from './candidate-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CandidateDetailPageRoutingModule
  ],
  declarations: [CandidateDetailPage]
})
export class CandidateDetailPageModule {}
