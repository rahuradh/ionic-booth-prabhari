import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoothAgentsPagePage } from './booth-agents-page.page';

const routes: Routes = [
  {
    path: '',
    component: BoothAgentsPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoothAgentsPagePageRoutingModule {}
