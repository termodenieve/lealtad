import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerVisitasPage } from './ver-visitas.page';

const routes: Routes = [
  {
    path: '',
    component: VerVisitasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerVisitasPageRoutingModule {}
