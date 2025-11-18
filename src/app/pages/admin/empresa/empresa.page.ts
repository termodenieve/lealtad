import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.page.html',
  styleUrls: ['./empresa.page.scss'],
  standalone: false
})
export class EmpresaPage implements OnInit {
  accessToken = '';
  nombre = '';
  direccion = '';
  telefono = '';

  constructor(private act: ActivatedRoute, private route: Router) {
    console.log(this.act.snapshot.queryParams);
    if (this.act.snapshot.queryParams['access_token']) {
      this.accessToken = this.act.snapshot.queryParams['access_token'];
    }
  }

  async ngOnInit() {
    if (this.accessToken) {
      try {
        const data = await axios.get(
          'http://localhost:1339/api/auth/google/callback?access_token=' + this.accessToken
        );

        console.log('Datos de usuario desde Google:', data.data);
        localStorage.setItem('token', data.data.jwt);
        localStorage.setItem('user', JSON.stringify(data.data.user));

      } catch (error) {
        console.error('Error al autenticar con Google:', error);
        alert('Error al iniciar sesión con Google');
      }
    }
  }


  async crearEmpresa() {
  if (!this.nombre || !this.direccion || !this.telefono) {
    alert('Por favor llena todos los campos');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || !user.id) {
      alert('Debes iniciar sesión antes de crear una empresa');
      return;
    }
    const rol = user.role?.type || user.role?.name || '';
    console.log("ROL DETECTADO:", rol);

    const res = await axios.post(
      'http://localhost:1339/api/empresas',
      {
        data: {
          nombre: this.nombre,
          direccion: this.direccion,
          telefono: this.telefono,
          user: user.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Empresa creada:', res.data);
    alert('Empresa registrada correctamente');

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
