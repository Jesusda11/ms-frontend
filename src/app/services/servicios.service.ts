
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicio } from '../models/servicio.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  constructor(private http: HttpClient) { }

  list(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${environment.url_ms_business}/servicios`);
  }

  delete(id: number): Observable<Servicio> {
    return this.http.delete<Servicio>(`${environment.url_ms_business}/servicios/${id}`);
  }

  view(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${environment.url_ms_business}/servicios/${id}`);
  }

  create(servicios: Servicio): Observable<Servicio> {
    delete servicios.id;
    return this.http.post<Servicio>(`${environment.url_ms_business}/servicios`, servicios);
  }

  update(servicios: Servicio): Observable<Servicio> {
    return this.http.put<Servicio>(`${environment.url_ms_business}/servicios/${servicios.id}`, servicios);
  }
}
  