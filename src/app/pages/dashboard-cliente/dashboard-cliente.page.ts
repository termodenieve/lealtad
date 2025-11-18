import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-dashboard-cliente',
  templateUrl: './dashboard-cliente.page.html',
  styleUrls: ['./dashboard-cliente.page.scss'],
  standalone: false,
})
export class DashboardClientePage implements OnInit {
  tabActiva: string = 'perfil';
  clientes: any = {};
  empresas: any[] = [];
  promociones: any[] = [];
  visitas: any[] = [];
  url = environment.url;

  constructor(private router: Router) {}

  async ngOnInit() {
    this.obtenerUsuario();
    await this.cargarEmpresas();
    await this.cargarVisitas();
  }

  cambiarTab(tab: string) {
    this.tabActiva = tab;
  }

  async obtenerUsuario() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.clientes = JSON.parse(userStr);
      console.log('Usuario cargado:', this.clientes);
    }
  }

  async cargarEmpresas() {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(this.url + '/empresas', {
        headers: { Authorization: `Bearer ${token}` },
      });

      this.empresas = res.data.data.map((e: any) => ({
        id: e.id,
        nombre: e.nombre || e.attributes?.username,
        direccion: e.direccion || e.attributes?.direccion,
        telefono: e.telefono || e.attributes?.telefono,
      }));

      console.log('Empresas disponibles:', this.empresas);
    } catch (error) {
      console.error('Error al cargar empresas:', error);
    }
  }
  async cargarVisitas() {
  try {
    const token = localStorage.getItem('token');

    const res = await axios.get(
      this.url + '/visitas?populate=empresa,cliente',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    this.visitas = res.data.data || [];

    console.log("Visitas cargadas:", this.visitas);

  } catch (error) {
    console.error("Error al cargar visitas del cliente:", error);
  }
}

editarPerfil() {
  localStorage.setItem('clienteId', this.clientes.id);
  this.router.navigateByUrl('/editar-user');
}



  //aplicarPromocion(promo: any) {
   // this.alertCtrl.create({
   //   header: 'Promoción Aplicada',
   //   message: `Has aplicado la promoción: ${promo.nombre}`,
    //  buttons: ['OK'],
   // }).then(alert => alert.present());
  //}
}
