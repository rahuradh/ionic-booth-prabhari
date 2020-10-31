import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangePasswordPagePage } from './change-password-page.page';

const routes: Routes = [
  {
    path: '',
    component: ChangePasswordPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangePasswordPagePageRoutingModule {}
