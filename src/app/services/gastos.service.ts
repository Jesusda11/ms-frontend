
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Gasto } from '../models/gasto.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GastosService {

  constructor(private http: HttpClient) { }

  list(): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(`${environment.url_ms_business}/gastos`);
  }

  delete(id: number): Observable<Gasto> {
    return this.http.delete<Gasto>(`${environment.url_ms_business}/gastos/${id}`);
  }

  view(id: number): Observable<Gasto> {
    return this.http.get<Gasto>(`${environment.url_ms_business}/gastos/${id}`);
  }

  create(gastos: Gasto): Observable<Gasto> {
    delete gastos.id;
    return this.http.post<Gasto>(`${environment.url_ms_business}/gastos`, gastos);
  }

  update(gastos: Gasto): Observable<Gasto> {
    return this.http.put<Gasto>(`${environment.url_ms_business}/gastos/${gastos.id}`, gastos);
  }

  listByDuenio(duenios_id: number): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(`${environment.url_ms_business}/gastos?duenios_id=${duenios_id}}`);
  }
}
  