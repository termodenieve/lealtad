import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'forgotpassword',
    loadChildren: () => import('./pages/forgotpassword/forgotpassword.module').then( m => m.ForgotpasswordPageModule)
  },
  {
    path: 'resetpassword',
    loadChildren: () => import('./pages/resetpassword/resetpassword.module').then( m => m.ResetpasswordPageModule)
  },
  {
    path: 'empresa',
    loadChildren: () => import('./pages/admin/empresa/empresa.module').then( m => m.EmpresaPageModule)
  },
  {
    path: 'promociones',
    loadChildren: () => import('./pages/admin/promociones/promociones.module').then( m => m.PromocionesPageModule)
  },
  
  {
    path: 'dashboard-admin',
    loadChildren: () => import('./pages/admin/dashboard-admin/dashboard-admin.module').then( m => m.DashboardAdminPageModule)
    },
  
  {
    path: 'editar-empresa',
    loadChildren: () => import('./pages/admin/editar-empresa/editar-empresa.module').then( m => m.EditarEmpresaPageModule)
  },
  {
    path: 'editar-promocion',
    loadChildren: () => import('./pages/admin/editar-promocion/editar-promocion.module').then( m => m.EditarPromocionPageModule)
  },
  
  {
    path: 'visitas',
    loadChildren: () => import('./pages/visitas/visitas.module').then( m => m.VisitasPageModule)
  },
  {
    path: 'clientes',
    loadChildren: () => import('./pages/admin/clientes/clientes.module').then( m => m.ClientesPageModule)
  },
  {
    path: 'dashboard-empresa',
    loadChildren: () => import('./pages/dashboard-empresa/dashboard-empresa.module').then( m => m.DashboardEmpresaPageModule)
  },
  {
    path: 'dashboard-cliente',
    loadChildren: () => import('./pages/dashboard-cliente/dashboard-cliente.module').then( m => m.DashboardClientePageModule)
  },
  {
    path: 'editar-visita',
    loadChildren: () => import('./pages/editar-visita/editar-visita.module').then( m => m.EditarVisitaPageModule)
  },
  {
    path: 'editar-user',
    loadChildren: () => import('./pages/editar-user/editar-user.module').then( m => m.EditarUserPageModule)
  },
  


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
