import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { config } from './config/database';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>(`${config.authentication_server_base_url}/users`);
  }

  getById(id: number) {
    return this.http.get<User>(`${config.authentication_server_base_url}/users/${id}`);
  }
}
