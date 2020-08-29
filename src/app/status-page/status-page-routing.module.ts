import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatusPagePage } from './status-page.page';

const routes: Routes = [
  {
    path: '',
    component: StatusPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusPagePageRoutingModule {}
