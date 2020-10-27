import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccessManagerPage } from './access-manager.page';

const routes: Routes = [
  {
    path: '',
    component: AccessManagerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessManagerPageRoutingModule {}
