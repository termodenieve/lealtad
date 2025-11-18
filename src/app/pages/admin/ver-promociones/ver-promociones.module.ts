import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerPromocionesPageRoutingModule } from './ver-promociones-routing.module';

import { VerPromocionesPage } from './ver-promociones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerPromocionesPageRoutingModule
  ],
  declarations: [VerPromocionesPage]
})
export class VerPromocionesPageModule {}
