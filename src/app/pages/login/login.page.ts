import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import axios from 'axios';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
import { Backend } from 'src/app/services/backend';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  url = environment.url;

  accessToken = '';
  identifier = '';
  password = '';
  loading = false;

  tokenFCM: any = '';

  constructor(private act: ActivatedRoute, private router: Router, private toastCtrl: ToastController, private api: Backend, private platform: Platform) {
    console.log(this.act.snapshot.queryParams);
    if (this.act.snapshot.queryParams['access_token']) {
      this.accessToken = this.act.snapshot.queryParams['access_token'];

    }
  }
  async ngOnInit() {
    if (this.accessToken) {
      try {
        const data = await axios.get(this.url + '/auth/google/callback?access_token=' + this.accessToken)
        console.log(data)
        localStorage.setItem('token', data.data.jwt);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        if (this.platform.is('capacitor')) {
          this.reqNotifications();
        }
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

      const res = await axios.post(this.url + '/auth/local', {
        identifier: this.identifier,
        password: this.password,
      });

      const token = res.data.jwt;
      const user = res.data.user;

      let tokenFCM: string | null = null;

      if (this.platform.is('capacitor')) {
        try {
          tokenFCM = await this.reqNotifications();
          console.log('FCM token:', tokenFCM);
        } catch (err) {
          console.warn('Notificaciones no permitidas o error:', err);
        }
      }

      const meRes = await axios.get(this.url + '/users/me?populate[role]=*', {


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
        if (tokenFCM) {
          this.api.getClientByUser(res.data.user.id, res.data.jwt)
            .then((client: any) => {
              console.log(client.data.data[0])
              const clientId = client.data.data[0].documentId;
              this.api.updateClientToken(clientId, tokenFCM!, res.data.jwt)
                .then(() => console.log('Token FCM actualizado correctamente'))
                .catch((err: any) => console.log('Error al actualizar token:', err));
            })
            .catch((err: any) => {
              console.log('Error al obtener cliente:', err);
            });
        }
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
        localStorage.setItem('tokenFCM', token.value);
        resolve(token.value);
      });

      PushNotifications.addListener('registrationError', (error: any) => {
        reject(error);
      });
    });
  }
  goToRegistro() {
  this.router.navigate(['/register']);
}

}