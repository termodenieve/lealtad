import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardClientePage } from './dashboard-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardClientePageRoutingModule {}
