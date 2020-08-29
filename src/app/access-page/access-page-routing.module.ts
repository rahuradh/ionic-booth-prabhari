import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccessPagePage } from './access-page.page';

const routes: Routes = [
  {
    path: '',
    component: AccessPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessPagePageRoutingModule {}
