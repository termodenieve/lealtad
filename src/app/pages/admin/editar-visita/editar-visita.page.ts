import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-editar-visita',
  templateUrl: './editar-visita.page.html',
  styleUrls: ['./editar-visita.page.scss'],
  standalone: false,
})
export class EditarVisitaPage implements OnInit {
  url = environment.url;
  documentId = '';
  monto: number | null = null;
  fecha: string = '';
  clienteId: string = '';
  empresaId: string = '';

  clientes: any[] = [];
  empresas: any[] = [];
  visita: any = {};

  constructor(private router: Router) {}

  async ngOnInit() {
    this.documentId = localStorage.getItem('visitaId') || '';

    if (!this.documentId) {
      alert('No se encontró la visita a editar');
      this.router.navigateByUrl('/dashboard-empresa');
      return;
    }

    await this.obtenerClientes();
    await this.obtenerEmpresas();
    await this.cargarVisita();
  }


  async cargarVisita() {
    const token = localStorage.getItem('token');

    try {
      const { data } = await axios.get(
        this.url + `/visitas/${this.documentId}?populate=*`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const attrs = data.data;
      console.log(attrs)

      this.visita = {
        monto: attrs.monto,
        fecha: attrs.fecha,
        clienteId: attrs.cliente.id || '',
        empresaId: attrs.empresa.id || '',
      };

      this.monto = this.visita.monto;
      this.fecha = this.visita.fecha;
      this.clienteId = this.visita.clienteId;
      this.empresaId = this.visita.empresaId;

      console.log('Visita cargada:', this.visita);
      console.log(this.clienteId, this.empresaId);
      

    } catch (error: any) {
      console.error('Error al cargar Visita:', error.response?.data || error);
      alert('No se pudo cargar la información de la visita');
    }
  }


  async obtenerClientes() {
  const token = localStorage.getItem('token');

  try {
    const res = await axios.get(this.url + `/clientes`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    this.clientes = res.data.data

    console.log("clientes jijija:", this.clientes);

  } catch (error: any) {
    console.error("Error al cargar clientes:", error.response?.data || error);
    alert("No se pudieron cargar los clientes");
  }
}


  async obtenerEmpresas() {
    const token = localStorage.getItem('token');

    try {
      const res = await axios.get(this.url + `/empresas`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      this.empresas = res.data.data

      console.log(this.empresas)

    } catch (error) {
      console.error("Error al cargar empresas:", error);
      alert("No se pudieron cargar las empresas");
    }
  }


  async editarVisita() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
      alert('Debes iniciar sesión');
      this.router.navigateByUrl('/login');
      return;
    }

    const rol = user.role?.type || user.role?.name || '';

    if (rol !== "admin" && rol !== "empresa") {
      alert("No tienes permisos para editar visitas.");
      return;
    }

 
    if (!this.clienteId || !this.empresaId) {
      alert("Selecciona cliente y empresa");
      return;
    }

    const data: any = {
      monto: this.monto,
      fecha: this.fecha,
      cliente: this.clienteId,
      empresa: this.empresaId,
    };

    try {
      await axios.put(
        this.url + `/visitas/${this.documentId}`,
        { data },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Visita actualizada correctamente");

      if (rol === "admin") {
        this.router.navigateByUrl("/dashboard-admin");
      } else {
        this.router.navigateByUrl("/dashboard-empresa");
      }

    } catch (error: any) {
      console.error("Error al editar visita:", error.response?.data || error);
      alert("Error al actualizar la visita");
    }
  }

  cancelarEdicion() {
    this.router.navigateByUrl('/dashboard-empresa');
  }
}
