import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SecurityService } from '../services/security.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NoAuthenticatedGuard implements CanActivate {
  constructor(private securityService: SecurityService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.securityService.existSession()) {
      // Mostrar alerta con SweetAlert2
      Swal.fire({
        title: 'Sesión activa',
        text: 'Ya tienes una sesión activa. Serás redirigido al dashboard.',
        icon: 'info',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        // Redirigir al dashboard después de que el usuario cierre la alerta
        this.router.navigate(['/dashboard']);
      });

      return false; // Bloquea el acceso a la ruta
    }

    return true; // Permite el acceso si no hay sesión activa
  }
}
