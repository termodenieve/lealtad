import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.page.html',
  styleUrls: ['./visitas.page.scss'],
  standalone: false,
})
export class VisitasPage implements OnInit {
  url = environment.url;
  monto: number | null = null;
  fecha: string = '';
  clienteId: string = '';
  empresaId: string = '';

  clientes: any[] = [];
  empresas: any[] = [];

  constructor(private route: Router) { }

  async ngOnInit() {
    await this.obtenerEmpresas();
    await this.obtenerClientes();

  }

  async obtenerClientes() {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(this.url + "/clientes", {
        headers: { Authorization: `Bearer ${token}` }
      });

      this.clientes = res.data.data.map((c: any) => ({
        id: c.documentId,
        nombre: c.nombre
      }));

      console.log("Clientes cargados:", this.clientes);

    } catch (error) {
      console.error("Error cargando clientes:", error);
      alert("No se pudieron cargar los clientes");
    }

  }


  async obtenerEmpresas() {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(this.url + "/empresas", {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.empresas = res.data.data.map((e: any) => ({
        id: e.id,
        nombre: e.nombre
      }));

      console.log("Empresas cargadas:", this.empresas);

    } catch (error) {
      console.error("Error cargando empresas:", error);
      alert("No se pudieron cargar las empresas");
    }
  }

  async crearVisita() {
    if (!this.monto || !this.fecha || !this.clienteId || !this.empresaId) {

      return;
    }

    try {
      const token = localStorage.getItem('token');
      const fechaISO = new Date(this.fecha).toISOString().split("T")[0];
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (!token || !user.id) {
        alert('Debes iniciar sesión antes de registrar una visita');
        return;
      }

      const rol = user.role?.type || user.role?.name || '';
      console.log("ROL DETECTADO:", rol);

      const res = await axios.post(
        this.url + '/visitas',
        {
          data: {
            monto: this.monto,
            fecha: fechaISO,
            cliente: this.clienteId,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );


      console.log('Visita registrada:', res.data);
      alert('Visita registrada correctamente');
      if (rol === 'admin') {
        this.route.navigateByUrl('/dashboard-admin');
      }
      else if (rol === 'empresa') {
        this.route.navigateByUrl('/dashboard-empresa');
      }
      else {
        console.warn("Rol desconocido:", rol);
        this.route.navigateByUrl('/login');
      }

    } catch (error: any) {
      console.error('Error al registrar visita:', error);
      alert('Error al registrar la visita');
    }
  }


}
