import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../authentication.service';
import { LoggerService } from '../logger.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private loggerService: LoggerService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header containing JWT token if user is logged in
        this.loggerService.add("Intercepted by JwtInterceptor");
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.token) {
            this.loggerService.add("JwtInterceptor: logged in, adding JWT token");
            request = request.clone({
                setHeaders: {
                    'auth-token': `${currentUser.token}`
                }
            });
        }

        return next.handle(request);
    }
}