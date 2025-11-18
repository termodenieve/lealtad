import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';


@Component({
  selector: 'app-ver-empresas',
  templateUrl: './ver-empresas.page.html',
  styleUrls: ['./ver-empresas.page.scss'],
  standalone: false,
})
export class VerEmpresasPage implements OnInit {
  empresas: any[] = [];
  role: string = '';
  loading = false;

  constructor(private router: Router,) { }

  async ngOnInit() {

    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);

        this.role = user.role?.type || user.role?.name || '';
      }


      await this.obtenerEmpresas();
    } catch (err) {
      console.error('Error al inicializar empresa.page:', err);
    }
  }

  async obtenerEmpresas() {
    this.loading = true;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión para ver las empresas');
        this.empresas = [];
        this.loading = false;
        return;
      }

      const res = await axios.get('http://localhost:1339/api/empresas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      this.empresas = res.data?.data || [];
      console.log('Empresas obtenidas:', this.empresas);
    } catch (error) {
      console.error('Error al obtener empresas:', error);
      alert('No se pudieron cargar las empresas');
      this.empresas = [];
    } finally {
      this.loading = false;
    }
  }


  irCrearEmpresa() {
    if (this.role !== 'admin' && this.role !== 'empresa') {
      alert('No tienes permiso para crear empresas');
      return;
    }
    this.router.navigateByUrl('/empresa');
  }


  editarEmpresa(documentId: string) {
    this.router.navigateByUrl(`admin/empresa/editar/${documentId}`);
  }

  async eliminarEmpresa(documentId: string) {
    const confirmar = confirm('¿Eliminar esta empresa?');
    if (!confirmar) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión');
        return;
      }

      const res = await axios.delete(
        `http://localhost:1339/api/empresas/${documentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Empresa eliminada:', res.data);
      alert('Empresa eliminada');
      await this.obtenerEmpresas();
    } catch (err) {
      console.error('Error al eliminar empresa:', err);
      alert('No fue posible eliminar la empresa');
    }
  }
}