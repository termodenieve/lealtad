import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: false,
})
export class ClientesPage implements OnInit {
  url = environment.url;
  identifier: string = '';
  password: string = '';
  email: string = '';
  username: string = '';

  constructor() { }

  ngOnInit() {
  }

}
