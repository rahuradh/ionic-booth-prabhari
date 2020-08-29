import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPagePageRoutingModule } from './detail-page-routing.module';

import { DetailPagePage } from './detail-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailPagePageRoutingModule
  ],
  declarations: [DetailPagePage]
})
export class DetailPagePageModule {}
