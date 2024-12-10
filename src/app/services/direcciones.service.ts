
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Direccion } from '../models/direccion.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DireccionesService {

  constructor(private http: HttpClient) { }

  list(): Observable<Direccion[]> {
    return this.http.get<Direccion[]>(`${environment.url_ms_business}/direcciones`);
  }

  delete(id: number): Observable<Direccion> {
    return this.http.delete<Direccion>(`${environment.url_ms_business}/direcciones/${id}`);
  }

  view(id: number): Observable<Direccion> {
    return this.http.get<Direccion>(`${environment.url_ms_business}/direcciones/${id}`);
  }

  create(direcciones: Direccion): Observable<Direccion> {
    delete direcciones.id;
    return this.http.post<Direccion>(`${environment.url_ms_business}/direcciones`, direcciones);
  }

  update(direcciones: Direccion): Observable<Direccion> {
    return this.http.put<Direccion>(`${environment.url_ms_business}/direcciones/${direcciones.id}`, direcciones);
  }
}
  