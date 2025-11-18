import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-ver-visitas',
  templateUrl: './ver-visitas.page.html',
  styleUrls: ['./ver-visitas.page.scss'],
  standalone: false,
})
export class VerVisitasPage implements OnInit {
  visitas: any[] = [];
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

      await this.obtenerVisitas();
    } catch (err) {
      console.error('Error al inicializar VerVisitasPage:', err);
    }
  }

  /**
   * Obtiene las visitas según el rol del usuario autenticado
   */
  async obtenerVisitas() {
    this.loading = true;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión para ver las visitas');
        this.visitas = [];
        this.loading = false;
        return;
      }

      const res = await axios.get('http://localhost:1339/api/visitas?populate[empresa]=*&populate[cliente]=*', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // El backend ya filtra según el rol del usuario
      this.visitas = res.data?.data || [];

      console.log('Visitas obtenidas:', this.visitas);
    } catch (error) {
      console.error('Error al obtener visitas:', error);
      alert('No se pudieron cargar las visitas');
      this.visitas = [];
    } finally {
      this.loading = false;
    }
  }

  /**
   * Redirige al formulario de creación de visitas
   */
  irCrearVisita() {
    if (this.role !== 'admin' && this.role !== 'empresa') {
      alert('No tienes permiso para crear visitas');
      return;
    }
    this.router.navigateByUrl('/admin/visita/crear');
  }

  /**
   * Redirige al formulario de edición
   */
  editarVisita(documentId: string) {
    this.router.navigateByUrl(`/admin/visita/editar/${documentId}`);
  }

  /**
   * Elimina una visita seleccionada
   */
  async eliminarVisita(documentId: string) {
    const confirmar = confirm('¿Quieres eliminar esta visita?');
    if (!confirmar) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión');
        return;
      }

      await axios.delete(`http://localhost:1339/api/visitas/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Visita eliminada con éxito');
      await this.obtenerVisitas();
    } catch (err) {
      console.error('Error al eliminar visita:', err);
      alert('No fue posible eliminar la visita');
    }
  }
}
