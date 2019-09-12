import { Component } from '@angular/core';

import { LoggerService } from './logger.service';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { User } from './models/user';
import { Role } from './models/role';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title: string = 'music';
  appTitle: string = 'Music filter';
  valueToBePassed: string = 'some value over here';
  currentUser: User;

  constructor (
    private loggerService: LoggerService,
    private router: Router,
    private authenticatorService: AuthenticationService
    ) {
      this.authenticatorService.currentUser.subscribe(x => this.currentUser = x);
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.ADMIN;
  }

  logout() {
    this.authenticatorService.logout();
    // this.router.navigate(['/login']);
  }
}
