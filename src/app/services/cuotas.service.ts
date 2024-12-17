
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cuota } from '../models/cuota.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CuotasService {

  constructor(private http: HttpClient) { }

  list(): Observable<Cuota[]> {
    return this.http.get<Cuota[]>(`${environment.url_ms_business}/cuotas`);
  }

  delete(id: number): Observable<Cuota> {
    return this.http.delete<Cuota>(`${environment.url_ms_business}/cuotas/${id}`);
  }

  view(id: number): Observable<Cuota> {
    return this.http.get<Cuota>(`${environment.url_ms_business}/cuotas/${id}`);
  }

  create(cuotas: Cuota): Observable<Cuota> {
    delete cuotas.id;
    return this.http.post<Cuota>(`${environment.url_ms_business}/cuotas`, cuotas);
  }

  update(cuotas: Cuota): Observable<Cuota> {
    return this.http.put<Cuota>(`${environment.url_ms_business}/cuotas/${cuotas.id}`, cuotas);
  }

  listByContract(contrato_id: number): Observable<Cuota[]> {
    return this.http.get<Cuota[]>(`${environment.url_ms_business}/cuotas?contrato_id=${contrato_id}}`);
  }
}
  