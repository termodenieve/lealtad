import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-editar-promocion',
  templateUrl: './editar-promocion.page.html',
  styleUrls: ['./editar-promocion.page.scss'],
  standalone: false,
})
export class EditarPromocionPage implements OnInit {
  url = environment.url;
  documentId = '';
  nombre = '';
  visitas = '';
  descripcion = '';
  promocion: any = {};

  constructor(private router: Router) { }

  async ngOnInit() {
    this.documentId = localStorage.getItem('promocionId') || '';
    if (!this.documentId) {
      alert('No se encontró la promoción a editar');
      this.router.navigateByUrl('/login');
      return;
    }
    await this.cargarPromocion();
  }

  async cargarPromocion() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para ver esta página');
      this.router.navigateByUrl('/login');
      return;
    }

    try {
      const res = await axios.get(
        this.url + `/promociones/${this.documentId}?populate[empresa]=*`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const promocion = res.data.data;
      if (!promocion) {
        alert('No se encontró la promoción');
        this.router.navigateByUrl('/login');
        return;
      }


      const datos = promocion.attributes ? promocion.attributes : promocion;

      this.nombre = datos.nombre || '';
      this.visitas = datos.visitas || '';
      this.descripcion = datos.descripcion || '';

      this.promocion = { ...datos };

      console.log('Promoción cargada (normalizada):', datos);
    } catch (error: any) {
      console.error('Error al cargar promoción:', error.response?.data || error);
      alert('No se pudo cargar la información de la promoción');
    }
  }

  async editarPromocion() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token) {
      alert('Debes iniciar sesión antes de editar la promoción');
      this.router.navigateByUrl('/login');
      return;
    }
    const rol = user.role?.type || user.role?.name || '';
    console.log("ROL DETECTADO:", rol);


    const data: any = {};

    if (this.nombre !== this.promocion.nombre)
      data.nombre = this.nombre;

    if (this.descripcion !== this.promocion.descripcion)
      data.descripcion = this.descripcion;

    if (Object.keys(data).length === 0) {
      alert('No realizaste ningún cambio');
      return;
    }

    await axios.put(
      this.url + `/promociones/${this.documentId}`,
      { data },
      { headers: { Authorization: `Bearer ${token}` } }
    );


    alert('Promoción actualizada correctamente');

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

  } catch(error: any) {
    console.error('Error al editar empresa:', error.response?.data || error);
    alert('Error al actualizar la empresa');
  }
}
