import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarVisitaPage } from './editar-visita.page';

const routes: Routes = [
  {
    path: '',
    component: EditarVisitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarVisitaPageRoutingModule {}
