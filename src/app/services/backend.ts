import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class Backend {
  constructor() { }
  url = environment.url;

  getToken(token: string) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    return config;
  }

  // Actualización de token FCM
  updateClientToken(id: string, tokenFCM: any, token: string) {
    return axios.put(this.url + '/clientes/' + id, {data: { tokenFCM }}, this.getToken(token))
  }

  getClientByUser(user: string, token: string){
    return axios.get(this.url + '/client-by-user/' + user, this.getToken(token));
  }
  
}
