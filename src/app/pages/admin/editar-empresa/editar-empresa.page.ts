import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-empresa',
  templateUrl: './editar-empresa.page.html',
  styleUrls: ['./editar-empresa.page.scss'],
  standalone: false,
})
export class EditarEmpresaPage implements OnInit {
  documentId = '';
  nombre = '';
  direccion = '';
  telefono = '';
  empresa: any = {};

  constructor(private router: Router) {}

  async ngOnInit() {
    this.documentId = localStorage.getItem('empresaId') || '';
    if (!this.documentId) {
      alert('No se encontró la empresa a editar');
      this.router.navigateByUrl('/login');
      return;
    }
    await this.cargarEmpresa();
  }

 async cargarEmpresa() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Debes iniciar sesión para ver esta página');
    this.router.navigateByUrl('/login');
    return;
  }

  try {
    const res = await axios.get(`http://localhost:1339/api/empresas/${this.documentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const empresa = res.data.data;
    if (!empresa) {
      alert('No se encontró la empresa');
      this.router.navigateByUrl('/login');
      return;
    }
    const datos = empresa.attributes ? empresa.attributes : empresa;

    this.nombre = datos.nombre || '';
    this.direccion = datos.direccion || '';
    this.telefono = datos.telefono || '';

    this.empresa = { ...datos };

    console.log('Empresa cargada (normalizada):', datos);
  } catch (error: any) {
    console.error('Error al cargar empresa:', error.response?.data || error);
    alert('No se pudo cargar la información de la empresa');
  }
}


  async editarEmpresa() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    alert('Debes iniciar sesión antes de editar la empresa');
    this.router.navigateByUrl('/login');
    return;
  }

  const rol = user.role?.type || user.role?.name || '';
  console.log("ROL DETECTADO:", rol);

  const data: any = {};

  if (this.nombre && this.nombre !== this.empresa.nombre)
    data.nombre = this.nombre;
  if (this.direccion && this.direccion !== this.empresa.direccion)
    data.direccion = this.direccion;
  if (this.telefono && this.telefono !== this.empresa.telefono)
    data.telefono = this.telefono;

  if (Object.keys(data).length === 0) {
    alert('No realizaste ningún cambio');
    return;
  }

  try {
    await axios.put(
      `http://localhost:1339/api/empresas/${this.documentId}`,
      { data },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert('Empresa actualizada correctamente');

    if (rol === 'admin') {
      this.router.navigateByUrl('/dashboard-admin');
    } 
    else if (rol === 'empresa') {
      this.router.navigateByUrl('/dashboard-empresa');
    } 
    else {
      console.warn("Rol desconocido:", rol);
      this.router.navigateByUrl('/home');
    }

  } catch (error: any) {
    console.error('Error al editar empresa:', error.response?.data || error);
    alert('Error al actualizar la empresa');
  }
}
}