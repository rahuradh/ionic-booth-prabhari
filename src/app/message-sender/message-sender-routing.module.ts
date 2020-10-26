import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MessageSenderPage } from './message-sender.page';

const routes: Routes = [
  {
    path: '',
    component: MessageSenderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessageSenderPageRoutingModule {}
