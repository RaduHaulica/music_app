import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../authentication.service';
import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private loggerService: LoggerService
  ) {
    // redirect to home if already logged in
    // if (this.authenticationService.currentUserValue) {
    //   this.router.navigate(['/']);
    // }
   }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameter or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // easier access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.loggerService.add(`Login form submitted. username: ${this.f.username.value} password: ${this.f.password.value}`);
    // stop if form invalid
    // if (this.loginForm.invalid) {
    //   return;
    // }

    this.loading = true;
    try {
      this.authenticationService.login(this.f.username.value, this.f.password.value).subscribe(x => this.loggerService.add(`AUTH: login: response - ${x}`));
    } catch(error) {
      this.loggerService.add(`AUTH: error - ${error}`);
    }
    // this.authenticationService.login(this.f.username.value, this.f.password.value)
    //   .pipe(first())
    //   .subscribe(
    //     data => {
    //       this.loggerService.add("Logged in.");
    //       this.loggerService.add(data);
    //       // this.router.navigate([this.returnUrl]);
    //     },
    //     error => {
    //       this.error = error;
    //       this.loading = false;
    //     }
    //   );

      // .pipe(map(user => {
      //   if (user && user.token) {
      //     // if response object is not empty and contains JWT token => login successful
      //     // store user object and JWT token in local storage to keep user logged in between page refresh
      //     localStorage.setItem('currentUser', JSON.stringify(user));
      //     this.currentUserSubject.next(user);
      //   }
      //   return user;
      // }));
  }

  register() {
    this.authenticationService.register(this.f.username.value, this.f.password.value).subscribe(x => this.loggerService.add(`AUTH: login: response - ${x}`));
  }
}
