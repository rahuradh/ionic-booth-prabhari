import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppUsersPagePage } from './app-users-page.page';

const routes: Routes = [
  {
    path: '',
    component: AppUsersPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppUsersPagePageRoutingModule {}
