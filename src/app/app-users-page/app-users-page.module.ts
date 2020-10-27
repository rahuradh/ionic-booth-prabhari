import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppUsersPagePageRoutingModule } from './app-users-page-routing.module';

import { AppUsersPagePage } from './app-users-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppUsersPagePageRoutingModule
  ],
  declarations: [AppUsersPagePage]
})
export class AppUsersPagePageModule {}
