import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppUserDetailPagePage } from './app-user-detail-page.page';

const routes: Routes = [
  {
    path: '',
    component: AppUserDetailPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppUserDetailPagePageRoutingModule {}
