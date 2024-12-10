
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Turno } from '../models/turno.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  constructor(private http: HttpClient) { }

  list(): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${environment.url_ms_business}/turnos`);
  }

  delete(id: number): Observable<Turno> {
    return this.http.delete<Turno>(`${environment.url_ms_business}/turnos/${id}`);
  }

  view(id: number): Observable<Turno> {
    return this.http.get<Turno>(`${environment.url_ms_business}/turnos/${id}`);
  }

  create(turnos: Turno): Observable<Turno> {
    delete turnos.id;
    return this.http.post<Turno>(`${environment.url_ms_business}/turnos`, turnos);
  }

  update(turnos: Turno): Observable<Turno> {
    return this.http.put<Turno>(`${environment.url_ms_business}/turnos/${turnos.id}`, turnos);
  }
}
  