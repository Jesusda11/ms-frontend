
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehiculo } from '../models/vehiculo.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {

  constructor(private http: HttpClient) { }

  list(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${environment.url_ms_business}/vehiculos`);
  }

  delete(id: number): Observable<Vehiculo> {
    return this.http.delete<Vehiculo>(`${environment.url_ms_business}/vehiculos/${id}`);
  }

  view(id: number): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${environment.url_ms_business}/vehiculos/${id}`);
  }

  create(vehiculos: Vehiculo): Observable<Vehiculo> {
    delete vehiculos.id;
    return this.http.post<Vehiculo>(`${environment.url_ms_business}/vehiculos`, vehiculos);
  }

  update(vehiculos: Vehiculo): Observable<Vehiculo> {
    return this.http.put<Vehiculo>(`${environment.url_ms_business}/vehiculos/${vehiculos.id}`, vehiculos);
  }
}
  