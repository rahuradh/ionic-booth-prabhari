import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangePasswordPagePageRoutingModule } from './change-password-page-routing.module';

import { ChangePasswordPagePage } from './change-password-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangePasswordPagePageRoutingModule
  ],
  declarations: [ChangePasswordPagePage]
})
export class ChangePasswordPagePageModule {}
