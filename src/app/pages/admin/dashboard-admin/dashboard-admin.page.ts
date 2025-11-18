import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.page.html',
  styleUrls: ['./dashboard-admin.page.scss'],
  standalone: false,
})
export class DashboardAdminPage implements OnInit {

  totalEmpresas = 0;
  totalClientes = 0;
  totalPromociones = 0;
  totalVisitas = 0;
  loading = false;
  empresas: any[] = [];
  clientes: any[] = [];
  promociones: any[] = [];
  visitas: any[] = [];
  role = '';

  busquedaVisitas: string = '';
  busquedaEmpresas: string = '';
busquedaPromociones: string = '';
busquedaClientes: string = '';

buscarEmpresas() {
  const term = (this.busquedaEmpresas || '').toLowerCase().trim();
  if (!term) {
    this.obtenerEmpresas(); 
    return;
  }
  this.empresas = this.empresas.filter((e: any) => {
    const nombre = (e.nombre || e.attributes?.nombre || '').toString().toLowerCase();
    const direccion = (e.direccion || e.attributes?.direccion || '').toString().toLowerCase();
    return nombre.includes(term) || direccion.includes(term);
  });
}

buscarPromociones() {
  const term = (this.busquedaPromociones || '').toLowerCase().trim();
  if (!term) {
    this.obtenerPromociones();
    return;
  }
  this.promociones = this.promociones.filter((p: any) => {
    const nombre = (p.nombre || '').toString().toLowerCase();
    const descripcion = (p.descripcion || '').toString().toLowerCase();
    return nombre.includes(term) || descripcion.includes(term);
  });
}

buscarVisitas() {
  const term = (this.busquedaVisitas || '').toLowerCase().trim();
  if (!term) {
    this.obtenerVisitas();
    return;
  }
  this.visitas = this.visitas.filter((v: any) => {
    const empresa = (v.empresa || '').toString().toLowerCase();
    const cliente = (v.cliente || '').toString().toLowerCase();
    return empresa.includes(term) || cliente.includes(term);
  });
}

buscarClientes() {
  const term = (this.busquedaClientes || '').toLowerCase().trim();
  if (!term) {
    this.obtenerClientes();
    return;
  }
  this.clientes = this.clientes.filter((c: any) => {
    const nombre = (c.nombre || '').toString().toLowerCase();
    const correo = (c.correo || '').toString().toLowerCase();
    const telefono = (c.telefono || '').toString().toLowerCase();
    const empresa = (c.empresa || '').toString().toLowerCase();
    return nombre.includes(term) || correo.includes(term) || telefono.includes(term) || empresa.includes(term);
  });
}



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

      const user = JSON.parse(userStr);
      this.role = user.role?.type || user.role?.name || '';

      if (this.role !== 'admin') {
        alert('Solo los administradores pueden acceder a este panel');
        this.router.navigateByUrl('/login');
        return;
      }

      await this.cargarDatos();
      await this.obtenerEmpresas();
      await this.obtenerPromociones();
      await this.obtenerVisitas();
      await this.obtenerClientes();

    } catch (err) {
      console.error('Error al inicializar dashboard:', err);
      alert('Ocurrió un error al cargar el panel');
    }
  }

tabActiva: string = 'empresas'; 

  cambiarTab(tab: string) {
    this.tabActiva = tab;
  }


  async cargarDatos() {
    this.loading = true;
    const token = localStorage.getItem('token');

    try {
      const empresasRes = await axios.get('http://localhost:1339/api/empresas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.totalEmpresas = empresasRes.data.meta?.pagination?.total || empresasRes.data.data.length || 0;

      const clientesRes = await axios.get('http://localhost:1339/api/clientes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.totalClientes = clientesRes.data.meta?.pagination?.total || clientesRes.data.data.length || 0;

      const promosRes = await axios.get('http://localhost:1339/api/promociones', {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.totalPromociones = promosRes.data.meta?.pagination?.total || promosRes.data.data.length || 0;

       const visitasRes = await axios.get('http://localhost:1339/api/visitas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.totalVisitas = visitasRes.data.meta?.pagination?.total || visitasRes.data.data.length || 0;


    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      alert('No se pudieron obtener los datos del panel');
    } finally {
      this.loading = false;
    }

  }
async obtenerClientes() {
  this.loading = true;
  const token = localStorage.getItem('token');

  try {
    const res = await axios.get(
      'http://localhost:1339/api/empresas?populate=*',
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const empresas = res.data?.data || [];

    this.clientes = empresas.flatMap((empresa: any) => {
      const attrs = empresa.attributes || {};
      const clientes = attrs.clientes || []; 

      return clientes.map((c: any) => ({
        documentId: c.documentId,
        nombre: c.nombre,
        correo: c.correo,
        telefono: c.telefono,
        empresa: c.empresa || attrs.nombre || 'Sin empresa'
      }));
    });

    console.log("CLIENTES ADMIN:", this.clientes);

  } catch (error) {
    console.error('Error al obtener clientes:', error);
  } finally {
    this.loading = false;
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
        headers: { Authorization: `Bearer ${token}` },
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
      empresa: p.empresa || null, 
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

    const res = await axios.get(
      'http://localhost:1339/api/visitas?populate[empresa]=*&populate[cliente]=*',
      { headers: { Authorization: `Bearer ${token}` } }
    );


    this.visitas = (res.data?.data || []).map((v: any) => {
      const attrs = v.attributes || v; 
      const empresa = attrs.empresa?.data?.attributes || attrs.empresa || null;
      const cliente = attrs.cliente?.data?.attributes || attrs.cliente || null;

      return {
        documentId: v.documentId,
        empresa: empresa ? empresa.nombre || empresa.razon_social || 'Sin nombre' : 'Sin empresa',
        cliente: cliente ? cliente.nombre || cliente.correo || 'Sin cliente' : 'Sin cliente',
        fecha: attrs.fecha || 'Sin fecha',
        monto: attrs.monto || 0,
      };
    });

    console.log('Visitas obtenidas:', this.visitas);
  } catch (error) {
    console.error('Error al obtener visitas:', error);
    alert('No se pudieron cargar las visitas');
    this.visitas = [];
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
//PROMOCION
  CrearPromociones() {
    if (this.role !== 'admin' && this.role !== 'empresa') {
      alert('No tienes permiso para crear empresas');
      return;
    }
    this.router.navigateByUrl('/promociones');
  }
editarPromocion(promocion: any) {
  localStorage.setItem('promocionId', promocion.documentId);
  this.router.navigateByUrl('/editar-promocion');
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

//VISITAS

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
      `http://localhost:1339/api/visitas/${documentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('Visita eliminada:', res.data);
    alert('Visita eliminada');
    await this.obtenerVisitas(); 
  } catch (err) {
    console.error('Error al eliminar visita:', err);
    alert('No fue posible eliminar la visita');
  }
}
  editarVisita(visita: any) {
  localStorage.setItem('visitaId', visita.id);
  this.router.navigateByUrl('/editar-visita');
}

  cerrarSesion() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
  
}
