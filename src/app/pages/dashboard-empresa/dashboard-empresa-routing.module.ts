import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardEmpresaPage } from './dashboard-empresa.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardEmpresaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardEmpresaPageRoutingModule {}
