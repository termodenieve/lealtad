import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
  standalone: false,
})
export class ForgotpasswordPage implements OnInit {
  url = environment.url;
  constructor() { }
  email= ''

  ngOnInit() {
  }
  async recoveryPassword() {
  try {
    await axios.post(this.url + '/auth/forgot-password', {
      email: this.email,  
    });

    alert('Correo de recuperación enviado, revisa tu bandeja.');
  } catch (error) {
    alert('Error enviando correo de recuperación.');
  }
}

}
