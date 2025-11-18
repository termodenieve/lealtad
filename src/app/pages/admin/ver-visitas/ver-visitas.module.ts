import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerVisitasPageRoutingModule } from './ver-visitas-routing.module';

import { VerVisitasPage } from './ver-visitas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerVisitasPageRoutingModule
  ],
  declarations: [VerVisitasPage]
})
export class VerVisitasPageModule {}
