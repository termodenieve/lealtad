import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import axios from 'axios';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  accessToken = '';
  identifier = '';
  password = '';
  loading = false;

  constructor(private act: ActivatedRoute, private router: Router, private toastCtrl: ToastController) {
    console.log(this.act.snapshot.queryParams);
    if (this.act.snapshot.queryParams['access_token']) {
      this.accessToken = this.act.snapshot.queryParams['access_token'];

    }
  }
  async ngOnInit() {
    if (this.accessToken) {
      try {
        const data = await axios.get('http://localhost:1339/api/auth/google/callback?access_token=' + this.accessToken)
        console.log(data)
        localStorage.setItem('token', data.data.jwt);
        localStorage.setItem('user', JSON.stringify(data.data.user)); 
        this.router.navigateByUrl('/home');


      } catch (error) {
        alert('error al iniciar sesion');
        console.error(error);
      }
    }
  }
 async login() {
    this.loading = true;
    try {

      const res = await axios.post('http://localhost:1339/api/auth/local', {
        identifier: this.identifier,
        password: this.password,
      });

      const token = res.data.jwt;
      const user = res.data.user;

  
      const meRes = await axios.get('http://localhost:1339/api/users/me?populate[role]=*', {
        

        headers: { Authorization: `Bearer ${token}` },
      });

 const userWithRole = meRes.data;


if (!userWithRole.role) {
  if (userWithRole.id === 3) {
    userWithRole.role = { name: 'cliente', type: 'cliente', id: 1 };
  }
}

localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(userWithRole));

const role = userWithRole.role?.type || userWithRole.role?.name;
const userId = userWithRole.id;
console.log('Usuario completo:', userWithRole);
console.log(`Rol detectado: ${role} (ID: ${userId})`);



      if (role === 'admin') {
        alert('Bienvenido administrador');
        this.router.navigateByUrl('/dashboard-admin');
      } else if (role === 'empresa') {
        alert('Bienvenido empresa');
        this.router.navigateByUrl('/dashboard-empresa');
      } else if (role === 'cliente') {
        alert('Bienvenido cliente');
        this.router.navigateByUrl('/dashboard-cliente');
      } else {
        alert('Rol no reconocido o sin permisos');
        localStorage.clear();
      }

    } catch (err: any) {
      console.error('Error en login:', err);
      alert('Credenciales incorrectas o usuario no autorizado');
    } finally {
      this.loading = false;
    }
  }
}