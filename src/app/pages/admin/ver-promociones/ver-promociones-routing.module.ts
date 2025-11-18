import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerPromocionesPage } from './ver-promociones.page';

const routes: Routes = [
  {
    path: '',
    component: VerPromocionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerPromocionesPageRoutingModule {}
