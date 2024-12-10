
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Direccionruta } from '../models/direccionruta.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DireccionrutasService {

  constructor(private http: HttpClient) { }

  list(): Observable<Direccionruta[]> {
    return this.http.get<Direccionruta[]>(`${environment.url_ms_business}/direccion_rutas`);
  }

  delete(id: number): Observable<Direccionruta> {
    return this.http.delete<Direccionruta>(`${environment.url_ms_business}/direccion_rutas/${id}`);
  }

  view(id: number): Observable<Direccionruta> {
    return this.http.get<Direccionruta>(`${environment.url_ms_business}/direccion_rutas/${id}`);
  }

  create(direccionrutas: Direccionruta): Observable<Direccionruta> {
    delete direccionrutas.id;
    return this.http.post<Direccionruta>(`${environment.url_ms_business}/direccion_rutas`, direccionrutas);
  }

  update(direccionrutas: Direccionruta): Observable<Direccionruta> {
    return this.http.put<Direccionruta>(`${environment.url_ms_business}/direccion_rutas/${direccionrutas.id}`, direccionrutas);
  }
}
  