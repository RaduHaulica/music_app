import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

// import { Config } from './config/authentication';
// const Config = require('./config/database');
const Config = { authentication_server_base_url: "http://localhost:3000" };

import { LoggerService } from './logger.service';

import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private loggerService: LoggerService) { 
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    this.loggerService.add(`AUTH: login called for ${Config.authentication_server_base_url}`);
    return this.http.post(`${Config.authentication_server_base_url}/user/login`, {username, password});
  }
  
  register(username: string, password: string): Observable<any> {
    this.loggerService.add(`AUTH: register called for ${Config.authentication_server_base_url}`);
    return this.http.post(`${Config.authentication_server_base_url}/user/register`, {username, password});
  }

  logout() {
    // removes user from local storage to mark it as logged out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
