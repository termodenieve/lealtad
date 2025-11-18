import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
  standalone: false,
})
export class ForgotpasswordPage implements OnInit {

  constructor() { }
  email= ''

  ngOnInit() {
  }
  async recoveryPassword() {
  try {
    await axios.post('http://localhost:1339/api/auth/forgot-password', {
      email: this.email,  
    });

    alert('Correo de recuperación enviado, revisa tu bandeja.');
  } catch (error) {
    alert('Error enviando correo de recuperación.');
  }
}

}
