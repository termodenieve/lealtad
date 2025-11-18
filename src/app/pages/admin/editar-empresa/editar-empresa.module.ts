import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarEmpresaPageRoutingModule } from './editar-empresa-routing.module';

import { EditarEmpresaPage } from './editar-empresa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarEmpresaPageRoutingModule
  ],
  declarations: [EditarEmpresaPage]
})
export class EditarEmpresaPageModule {}
