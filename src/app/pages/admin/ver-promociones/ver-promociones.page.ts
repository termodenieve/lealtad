import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-ver-promociones',
  templateUrl: './ver-promociones.page.html',
  styleUrls: ['./ver-promociones.page.scss'],
  standalone: false,
})
export class VerPromocionesPage implements OnInit {
  promociones: any[] = [];
  empresas: any[] = [];
  role: string = '';
  loading = false;

  constructor(private router: Router) {}

  async ngOnInit() {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        this.role = user.role?.type || user.role?.name || '';
      }

      await this.obtenerPromociones();
    } catch (err) {
      console.error('Error al inicializar ver-promociones.page:', err);
    }
  }

 async obtenerPromociones() {
  this.loading = true;
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para ver las promociones');
      this.promociones = [];
      this.loading = false;
      return;
    }

    const res = await axios.get('http://localhost:1339/api/promociones', {
      headers: { Authorization: `Bearer ${token}` },
    });

    this.promociones = (res.data?.data || []).map((p: any) => ({
      documentId: p.documentId,
      nombre: p.nombre,
      descripcion: p.descripcion,
      empresa: p.empresa || null, // Aseguramos que exista
    }));

    console.log('Promociones obtenidas:', this.promociones);
  } catch (error) {
    console.error('Error al obtener promociones:', error);
    alert('No se pudieron cargar las promociones');
    this.promociones = [];
  } finally {
    this.loading = false;
  }
}


  irCrearPromocion() {
    if (this.role !== 'admin' && this.role !== 'empresa') {
      alert('Solo las empresas o administradores pueden crear promociones');
      return;
    }
    this.router.navigateByUrl('/promociones');
  }

  editarPromocion(documentId: string) {
    this.router.navigateByUrl(`admin/promocion/editar/${documentId}`);
  }

  async eliminarPromocion(documentId: string) {
    const confirmar = confirm('¿Eliminar esta promoción?');
    if (!confirmar) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión');
        return;
      }

      const res = await axios.delete(
        `http://localhost:1339/api/promociones/${documentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Promoción eliminada:', res.data);
      alert('Promoción eliminada');
      await this.obtenerPromociones();
    } catch (err) {
      console.error('Error al eliminar promoción:', err);
      alert('No fue posible eliminar la promoción');
    }
  }
}
