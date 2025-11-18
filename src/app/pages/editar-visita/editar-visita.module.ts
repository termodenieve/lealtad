import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarVisitaPageRoutingModule } from './editar-visita-routing.module';

import { EditarVisitaPage } from './editar-visita.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarVisitaPageRoutingModule
  ],
  declarations: [EditarVisitaPage]
})
export class EditarVisitaPageModule {}
