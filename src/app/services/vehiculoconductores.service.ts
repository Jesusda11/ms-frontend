
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehiculoconductor } from '../models/vehiculoconductor.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiculoconductoresService {

  constructor(private http: HttpClient) { }

  list(): Observable<Vehiculoconductor[]> {
    return this.http.get<Vehiculoconductor[]>(`${environment.url_ms_business}/vehiculo_conductores`);
  }

  delete(id: number): Observable<Vehiculoconductor> {
    return this.http.delete<Vehiculoconductor>(`${environment.url_ms_business}/vehiculo_conductores/${id}`);
  }

  view(id: number): Observable<Vehiculoconductor> {
    return this.http.get<Vehiculoconductor>(`${environment.url_ms_business}/vehiculo_conductores/${id}`);
  }

  create(vehiculoconductores: Vehiculoconductor): Observable<Vehiculoconductor> {
    delete vehiculoconductores.id;
    return this.http.post<Vehiculoconductor>(`${environment.url_ms_business}/vehiculo_conductores`, vehiculoconductores);
  }

  update(vehiculoconductores: Vehiculoconductor): Observable<Vehiculoconductor> {
    return this.http.put<Vehiculoconductor>(`${environment.url_ms_business}/vehiculo_conductores/${vehiculoconductores.id}`, vehiculoconductores);
  }
}
  