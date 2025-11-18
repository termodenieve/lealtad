import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.page.html',
  styleUrls: ['./promociones.page.scss'],
  standalone: false,
})
export class PromocionesPage implements OnInit {
  accessToken = '';
  nombre = '';
  descripcion = '';
  visitas = 0;
  empresaId = '';
  empresas: any[] = [];


  constructor(private act: ActivatedRoute, private route: Router) {}
  async ngOnInit() {
    await this.cargarEmpresas();
  }

  async cargarEmpresas() {
  try {
    const token = localStorage.getItem('token');

    const res = await axios.get(
      'http://localhost:1339/api/empresas?fields=documentId,nombre',
      { headers: { Authorization: `Bearer ${token}` } }
    );

    this.empresas = res.data.data.map((e: any) => ({
      id: e.documentId,
      nombre: e.nombre
    }));
  } catch (err) {
    console.error('Error cargando empresas:', err);
  }
}

  async crearPromocion() {
    if (!this.nombre || !this.descripcion || this.visitas <= 0 || !this.empresaId) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (!token || !user.id) {
        alert('Debes iniciar sesión antes de crear una promoción');
        return;
      }

      const rol = user.role?.type || user.role?.name || '';
      console.log("ROL DETECTADO:", rol);

      

      const res = await axios.post(
        'http://localhost:1339/api/promociones',
        {
          data: {
            
            nombre: this.nombre,
            descripcion: this.descripcion,
            visitas: this.visitas,
            empresa: this.empresaId,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Promoción creada:', res.data);
      alert('Promoción creada correctamente');

     if (rol === 'admin') {
      this.route.navigateByUrl('/dashboard-admin');
    } 
    else if (rol === 'empresa') {
      this.route.navigateByUrl('/dashboard-empresa');
    } 
    else {
      console.warn("Rol desconocido:", rol);
      this.route.navigateByUrl('/home');
    }

  } catch (error: any) {
    console.error('Error al registrar empresa:', error);
    alert('Error al registrar la empresa');
  }
}

}