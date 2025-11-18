import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarEmpresaPage } from './editar-empresa.page';

const routes: Routes = [
  {
    path: '',
    component: EditarEmpresaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarEmpresaPageRoutingModule {}
