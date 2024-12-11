
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Administrador } from '../models/administrador.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdministradoresService {

  constructor(private http: HttpClient) { }

  list(): Observable<Administrador[]> {
    return this.http.get<Administrador[]>(`${environment.url_ms_business}/administradores`);
  }

  delete(id: number): Observable<Administrador> {
    return this.http.delete<Administrador>(`${environment.url_ms_business}/administradores/${id}`);
  }

  view(id: number): Observable<Administrador> {
    return this.http.get<Administrador>(`${environment.url_ms_business}/administradores/${id}`);
  }

  create(administradores: Administrador): Observable<Administrador> {
    delete administradores.id;
    return this.http.post<Administrador>(`${environment.url_ms_business}/administradores`, administradores);
  }

  update(administradores: Administrador): Observable<Administrador> {
    return this.http.put<Administrador>(`${environment.url_ms_business}/administradores/${administradores.id}`, administradores);
  }
}
  