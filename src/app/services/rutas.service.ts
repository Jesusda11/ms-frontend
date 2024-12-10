
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ruta } from '../models/ruta.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  constructor(private http: HttpClient) { }

  list(): Observable<Ruta[]> {
    return this.http.get<Ruta[]>(`${environment.url_ms_business}/rutas`);
  }

  delete(id: number): Observable<Ruta> {
    return this.http.delete<Ruta>(`${environment.url_ms_business}/rutas/${id}`);
  }

  view(id: number): Observable<Ruta> {
    return this.http.get<Ruta>(`${environment.url_ms_business}/rutas/${id}`);
  }

  create(rutas: Ruta): Observable<Ruta> {
    delete rutas.id;
    return this.http.post<Ruta>(`${environment.url_ms_business}/rutas`, rutas);
  }

  update(rutas: Ruta): Observable<Ruta> {
    return this.http.put<Ruta>(`${environment.url_ms_business}/rutas/${rutas.id}`, rutas);
  }
}
  