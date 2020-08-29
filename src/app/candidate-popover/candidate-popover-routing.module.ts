import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidatePopoverPage } from './candidate-popover.page';

const routes: Routes = [
  {
    path: '',
    component: CandidatePopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidatePopoverPageRoutingModule {}
