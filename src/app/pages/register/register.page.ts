import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { Platform, ToastController } from '@ionic/angular';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})

export class RegisterPage implements OnInit {
 url = environment.url;
  
  nombre = '';
  telefono = '';
  email = '';
  password = '';

  loading = false;

  tokenFCM: string | null = null;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private platform: Platform
  ) {}

  ngOnInit() {}

 async registrar() {
  this.loading = true;

  try {
    const reg = await axios.post(this.url + '/auth/local/register', {
      username: this.nombre,
      email: this.email,
      password: this.password
    });

    const token = reg.data.jwt;
    const user = reg.data.user;

    let tokenFCM: string | null = null;

    if (this.platform.is('capacitor')) {
      try {
        tokenFCM = await this.reqNotifications();
      } catch {}
    }

    await axios.post(
      this.url + '/clientes',
      {
        data: {
          nombre: this.nombre,
          telefono: this.telefono,
          tokenFCM: tokenFCM || '',
          user: user.documentId,   
        }
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    this.router.navigateByUrl('/dashboard-cliente');
    this.presentToast('Registro exitoso, bienvenido');

  } catch (err) {
    console.error(err);
    alert('Error al registrar');
  } finally {
    this.loading = false;
  }
}


  async registrarGoogle(accessToken: string) {
    try {
      const res = await axios.get(this.url + '/auth/google/callback?access_token=' + accessToken);

      const token = res.data.jwt;
      const user = res.data.user;


      if (this.platform.is('capacitor')) {
        this.tokenFCM = await this.reqNotifications();
      }


      const exists = await axios.get(
        `${this.url}/clientes?filters[user][id][$eq]=${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (exists.data.data.length === 0) {

        await axios.post(
          `${this.url}/clientes`,
          {
            data: {
              nombre: user.username,
              telefono: '',
              tokenFCM: this.tokenFCM || '',
              user: user.id
            }
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }


      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      this.router.navigateByUrl('/dashboard-cliente');

    } catch (err) {
      console.error(err);
      alert('Error al registrar con Google');
    }
  }

  reqNotifications(): Promise<string> {
    return new Promise((resolve, reject) => {
      PushNotifications.requestPermissions().then((result) => {
        if (result.receive === 'granted') {
          PushNotifications.register();
        } else {
          reject('Permisos no concedidos');
        }
      });

      PushNotifications.addListener('registration', (token: Token) => {
        resolve(token.value);
      });

      PushNotifications.addListener('registrationError', (error: any) => {
        reject(error);
      });
    });
  }


  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }
}

