import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarPromocionPageRoutingModule } from './editar-promocion-routing.module';

import { EditarPromocionPage } from './editar-promocion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarPromocionPageRoutingModule
  ],
  declarations: [EditarPromocionPage]
})
export class EditarPromocionPageModule {}
