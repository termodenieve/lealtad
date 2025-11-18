import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarPromocionPage } from './editar-promocion.page';

const routes: Routes = [
  {
    path: '',
    component: EditarPromocionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarPromocionPageRoutingModule {}
