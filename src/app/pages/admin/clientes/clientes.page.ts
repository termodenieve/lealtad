import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: false,
})
export class ClientesPage implements OnInit {
  identifier: string = '';
  password: string = '';
  email: string = '';
  username: string = '';

  constructor() { }

  ngOnInit() {
  }

}
