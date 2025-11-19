import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-dashboard-empresa',
  templateUrl: './dashboard-empresa.page.html',
  styleUrls: ['./dashboard-empresa.page.scss'],
  standalone: false,
})
export class DashboardEmpresaPage implements OnInit {
  url = environment.url;
  usuario: any = null;
  misEmpresas: any[] = [];
  misClientes: any[] = [];
  misPromociones: any[] = [];
  misVisitas: any[] = [];

  busquedaEmpresa = '';
  busquedaPromocion = '';
  tabActiva: string = 'empresas';
  loading = false;
  role = '';

  constructor(private router: Router) { }

  async ngOnInit() {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!userStr || !token) {
        alert('Debes iniciar sesión');
        this.router.navigateByUrl('/login');
        return;
      }

      this.usuario = JSON.parse(userStr);
      this.role = this.usuario.role?.type || this.usuario.role?.name || '';

      if (this.role !== 'empresa') {
        alert('Solo las empresas pueden acceder a este panel');
        this.router.navigateByUrl('/login');
        return;
      }
      await this.obtenerMisEmpresas();
      await this.obtenerMisPromociones();
      await this.obtenerMisVisitas();
      await this.obtenerMisClientes();

    } catch (err) {
      console.error('Error al inicializar dashboard empresa:', err);
      alert('Ocurrió un error al cargar el panel');
    }
  }

  cambiarTab(tab: string) {
    this.tabActiva = tab;
  }

  async obtenerMisEmpresas() {
    this.loading = true;
    const token = localStorage.getItem('token');

    try {
      const res = await axios.get(this.url + `/empresas?populate=*`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      this.misEmpresas = res.data?.data?.map((e: any) => ({
        id: e.id,
        documentId: e.documentId,
        nombre: e.attributes?.nombre ?? e.nombre,
        direccion: e.attributes?.direccion ?? e.direccion,
        telefono: e.attributes?.telefono ?? e.telefono,
        clientes: e.attributes?.clientes || [],
      }));


      console.log('Empresas del usuario logueado:', this.misEmpresas);

    } catch (error) {
      console.error('Error al obtener empresas:', error);
      alert('No se pudieron cargar tus empresas');
    } finally {
      this.loading = false;
    }
  }



  async obtenerMisPromociones() {
    this.loading = true;
    const token = localStorage.getItem('token');

    try {
      const res = await axios.get(
        this.url + `/promociones?populate[empresa]=*`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      this.misPromociones = res.data?.data?.map((p: any) => {
        const attrs = p.attributes || p;
        const empresaData = attrs.empresa?.data?.attributes || attrs.empresa || {};
        const empresaDoc = attrs.empresa?.data?.documentId || null;
        return {
          documentId: p.documentId,
          nombre: attrs.nombre,
          descripcion: attrs.descripcion,
          empresa: {
            nombre: empresaData.nombre || 'Sin empresa',
            documentId: empresaDoc
          }
        };
      }) || [];

      console.log('Promociones cargadas:', this.misPromociones);

    } catch (error) {
      console.error(' Error al obtener promociones:', error);
      alert('No se pudieron cargar tus promociones');
    } finally {
      this.loading = false;
    }
  }


  async obtenerMisVisitas() {
    this.loading = true;
    const token = localStorage.getItem('token');

    try {
      const res = await axios.get(
        this.url + `/visitas?populate[cliente]=*&populate[empresa]=*`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      this.misVisitas = res.data?.data?.map((v: any) => {
        const attrs = v.attributes || v;
        const clienteData = attrs.cliente?.data?.attributes || attrs.cliente || {};
        const empresaData = attrs.empresa?.data?.attributes || attrs.empresa || {};

        return {
          id: v.id,
          documentId: v.documentId,

          cliente: clienteData.nombre || 'Sin cliente',
          empresa: empresaData.nombre || 'Sin empresa',
          fecha: attrs.fecha,
          monto: attrs.monto,
        };


      }) || [];

      console.log(' Visitas cargadas:', this.misVisitas);

    } catch (error) {
      console.error('Error al obtener visitas:', error);
      alert('No se pudieron cargar las visitas');
    } finally {
      this.loading = false;
    }
  }

  async obtenerMisClientes() {
    this.loading = true;
    const token = localStorage.getItem('token');

    try {

      const res = await axios.get(
        this.url + `/empresas`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('', res.data);

      const empresas = res.data?.data || [];

      this.misClientes = empresas.flatMap((empresa: any) => {
        const attrs = empresa.attributes || empresa;
        const clientes = attrs.clientes || [];

        return clientes.map((c: any) => ({
          documentId: c.documentId,
          nombre: c.nombre,
          correo: c.correo,
          telefono: c.telefono,
          empresa: c.empresa || attrs.nombre || 'Sin empresa',
        }));
      });

      console.log('Clientes cargados:', this.misClientes);

    } catch (error) {
      console.error('Error al obtener clientes:', error);
      alert('No se pudieron cargar los clientes');
    } finally {
      this.loading = false;
    }
  }




  //EMPRESA
  irCrearEmpresa() {
    if (this.role !== 'admin' && this.role !== 'empresa') {
      alert('No tienes permiso para crear empresas');
      return;
    }
    this.router.navigateByUrl('/empresa');
  }

  editarEmpresa(empresa: any) {
    localStorage.setItem('empresaId', empresa.documentId);
    this.router.navigateByUrl('/editar-empresa');
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
        this.url + `/empresas/${documentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Empresa eliminada:', res.data);
      alert('Empresa eliminada');
      await this.obtenerMisEmpresas();
    } catch (err) {
      console.error('Error al eliminar empresa:', err);
      alert('No fue posible eliminar la empresa');
    }
  }

  //PROMOCION
  irCrearProm() {
    if (this.role !== 'admin' && this.role !== 'empresa') {
      alert('No tienes permiso para crear empresas');
      return;
    }
    this.router.navigateByUrl('/promociones');
  }
  editarProm(promocion: any) {
    localStorage.setItem('promocionId', promocion.documentId);
    this.router.navigateByUrl('/editar-promocion');
  }


  async eliminarProm(documentId: string) {
    const confirmar = confirm('¿Eliminar esta promocion?');
    if (!confirmar) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión');
        return;
      }

      const res = await axios.delete(
        this.url + `/promociones/${documentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Promocion eliminada:', res.data);
      alert('Promocion eliminada');
      await this.obtenerMisPromociones();
    } catch (err) {
      console.error('Error al eliminar promocion:', err);
      alert('No fue posible eliminar la promocion');
    }


  }

  //VISITA
  crearVisita() {
    if (this.role !== 'admin' && this.role !== 'empresa') {
      alert('No tienes permiso para crear empresas');
      return;
    }
    this.router.navigateByUrl('/visitas');
  }

  async eliminarVisita(documentId: string) {
    const confirmar = confirm('¿Eliminar esta visita?');
    if (!confirmar) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión');
        return;
      }

      const res = await axios.delete(
        this.url + `/visitas/${documentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Visita eliminada:', res.data);
      alert('Visita eliminada');
      await this.obtenerMisVisitas();
    } catch (err) {
      console.error('Error al eliminar visita:', err);
      alert('No fue posible eliminar la visita');
    }
  }

  editarVisita(visita: any) {
    localStorage.setItem('visitaId', visita.id);
    this.router.navigateByUrl('/editar-visita');
  }

  //CLIENTE
  crearCliente() {
    if (this.role !== 'admin' && this.role !== 'empresa') {
      alert('No tienes permiso para crear empresas');
      return;
    }
    this.router.navigateByUrl('/clientes');
  }
   logout() {
  localStorage.clear();
  this.router.navigateByUrl('/login');
}

  async eliminarCliente(documentId: string) {
    const confirmar = confirm('¿Eliminar este cliente?');
    if (!confirmar) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión');
        return;
      }

      const res = await axios.delete(
        this.url + `/clientes/${documentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Cliente eliminado:', res.data);
      alert('Cliente eliminado');
      await this.obtenerMisClientes();

    } catch (err) {
      console.error('Error al eliminar cliente:', err);
      alert('No fue posible eliminar el cliente');
    }

    
  }


}
