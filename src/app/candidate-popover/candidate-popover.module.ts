import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidatePopoverPageRoutingModule } from './candidate-popover-routing.module';

import { CandidatePopoverPage } from './candidate-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CandidatePopoverPageRoutingModule
  ],
  declarations: [CandidatePopoverPage]
})
export class CandidatePopoverPageModule {}
