import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateDetailPage } from './candidate-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CandidateDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateDetailPageRoutingModule {}
