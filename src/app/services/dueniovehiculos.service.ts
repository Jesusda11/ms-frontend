
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dueniovehiculo } from '../models/dueniovehiculo.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DueniovehiculosService {

  constructor(private http: HttpClient) { }

  list(): Observable<Dueniovehiculo[]> {
    return this.http.get<Dueniovehiculo[]>(`${environment.url_ms_business}/duenio_vehiculos`);
  }

  delete(id: number): Observable<Dueniovehiculo> {
    return this.http.delete<Dueniovehiculo>(`${environment.url_ms_business}/duenio_vehiculos/${id}`);
  }

  view(id: number): Observable<Dueniovehiculo> {
    return this.http.get<Dueniovehiculo>(`${environment.url_ms_business}/duenio_vehiculos/${id}`);
  }

  create(dueniovehiculos: Dueniovehiculo): Observable<Dueniovehiculo> {
    delete dueniovehiculos.id;
    return this.http.post<Dueniovehiculo>(`${environment.url_ms_business}/duenio_vehiculos`, dueniovehiculos);
  }

  update(dueniovehiculos: Dueniovehiculo): Observable<Dueniovehiculo> {
    return this.http.put<Dueniovehiculo>(`${environment.url_ms_business}/duenio_vehiculos/${dueniovehiculos.id}`, dueniovehiculos);
  }
}
  