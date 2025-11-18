import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardClientePageRoutingModule } from './dashboard-cliente-routing.module';

import { DashboardClientePage } from './dashboard-cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardClientePageRoutingModule
  ],
  declarations: [DashboardClientePage]
})
export class DashboardClientePageModule {}
