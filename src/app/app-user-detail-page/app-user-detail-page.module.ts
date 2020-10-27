import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppUserDetailPagePageRoutingModule } from './app-user-detail-page-routing.module';

import { AppUserDetailPagePage } from './app-user-detail-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppUserDetailPagePageRoutingModule
  ],
  declarations: [AppUserDetailPagePage]
})
export class AppUserDetailPagePageModule {}
