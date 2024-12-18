import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { SecurityService } from '../services/security.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {

  constructor(private securityService: SecurityService,
    private router: Router) { }


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Si la solicitud es para la ruta de "login", no adjuntes el token
    //if (request.url.includes('/login') || request.url.includes('/token-validation')) {
    if(true){
      console.log("no se pone token")
      return next.handle(request);
      
    } else {
      let theUser = this.securityService.activeUserSession
      const token = theUser["token"];
      console.log("colocando token " + token) 
      // Adjunta el token a la solicitud
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next.handle(authRequest).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            Swal.fire({
              title: 'No está autorizado para esta operación',
              icon: 'error',
              timer: 5000
            });
            this.router.navigateByUrl('/dashboard');

          } else if (err.status === 400) {

            Swal.fire({
              title: 'Existe un error, contacte al administrador',
              icon: 'error',
              timer: 5000
            });
          }
          return new Observable<never>();
        }));

    }


    // Continúa con la solicitud modificada



  }
}
