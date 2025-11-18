import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerEmpresasPageRoutingModule } from './ver-empresas-routing.module';

import { VerEmpresasPage } from './ver-empresas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerEmpresasPageRoutingModule
  ],
  declarations: [VerEmpresasPage]
})
export class VerEmpresasPageModule {}
