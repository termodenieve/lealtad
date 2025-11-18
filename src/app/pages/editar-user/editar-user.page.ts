import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-user',
  templateUrl: './editar-user.page.html',
  styleUrls: ['./editar-user.page.scss'],
  standalone: false,
})
export class EditarUserPage implements OnInit {

  clienteId = '';
  nombre = '';
  telefono = '';
  correo = '';
  cliente: any = {};

  constructor(private router: Router) {}

  async ngOnInit() {
    await this.cargarCliente();
  }

  async cargarCliente() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      alert('Debes iniciar sesión');
      this.router.navigateByUrl('/login');
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:1339/api/clientes?filters[user][id][$eq]=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const cliente = res.data.data[0];

      if (!cliente) {
        alert("No se encontró información del cliente");
        return;
      }

      this.clienteId = cliente.documentId;
      const datos = cliente.attributes;

      this.nombre = datos.nombre || '';
      this.telefono = datos.telefono || '';


      this.correo = datos.user?.data?.attributes?.email || '';

      this.cliente = datos;

      console.log("Cliente cargado:", this.cliente);

    } catch (error: any) {
      console.error("Error al cargar cliente:", error.response?.data || error);
      alert("No se pudo cargar la información del cliente");
    }
  }

  async editarCliente() {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Debes iniciar sesión');
      return;
    }

    const data: any = {};

    if (this.nombre !== this.cliente.nombre) data.nombre = this.nombre;
    if (this.telefono !== this.cliente.telefono) data.telefono = this.telefono;

    if (Object.keys(data).length === 0) {
      alert("No realizaste cambios");
      return;
    }

    try {
      await axios.put(
        `http://localhost:1339/api/clientes/${this.clienteId}`,
        { data },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Perfil actualizado");
      this.router.navigateByUrl('/dashboard-cliente');

    } catch (error: any) {
      console.error("Error al actualizar cliente:", error.response?.data || error);
      alert("Error al guardar los cambios");
    }
  }
}
