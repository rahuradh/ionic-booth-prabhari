import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilterVoterPageRoutingModule } from './filter-voter-routing.module';

import { FilterVoterPage } from './filter-voter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FilterVoterPageRoutingModule
  ],
  declarations: [FilterVoterPage]
})
export class FilterVoterPageModule {}
