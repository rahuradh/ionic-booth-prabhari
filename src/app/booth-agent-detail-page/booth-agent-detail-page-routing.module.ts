import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoothAgentDetailPagePage } from './booth-agent-detail-page.page';

const routes: Routes = [
  {
    path: '',
    component: BoothAgentDetailPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoothAgentDetailPagePageRoutingModule {}
