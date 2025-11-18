import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.page.html',
  styleUrls: ['./resetpassword.page.scss'],
  standalone: false,
})
export class ResetpasswordPage implements OnInit {
  url = environment.url;
  password = '';
  passwordConfirmation = '';
  code = '';

  constructor(private act: ActivatedRoute) { 
    this.code = this.act.snapshot.queryParams['code'];
    console.log('Código recibido:', this.code);
  }

  ngOnInit() {}

  async changePassword() {
    try {
      await axios.post(this.url + '/auth/reset-password', {
        password: this.password,
        passwordConfirmation: this.passwordConfirmation,
        code: this.code
      });

      alert('Contraseña cambiada correctamente.');
    } catch (error) {
      alert('Error, token expirado o inválido. Vuelve a solicitar tu cambio de contraseña.');
    }
  }
}
