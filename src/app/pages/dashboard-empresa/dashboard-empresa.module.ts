import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardEmpresaPageRoutingModule } from './dashboard-empresa-routing.module';

import { DashboardEmpresaPage } from './dashboard-empresa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardEmpresaPageRoutingModule
  ],
  declarations: [DashboardEmpresaPage]
})
export class DashboardEmpresaPageModule {}
