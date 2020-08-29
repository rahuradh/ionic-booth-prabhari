import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilterVoterPage } from './filter-voter.page';

const routes: Routes = [
  {
    path: '',
    component: FilterVoterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilterVoterPageRoutingModule {}
