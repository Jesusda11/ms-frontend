
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Duenio } from '../models/duenio.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DueniosService {

  constructor(private http: HttpClient) { }

  list(): Observable<Duenio[]> {
    return this.http.get<Duenio[]>(`${environment.url_ms_business}/duenios`);
  }

  delete(id: number): Observable<Duenio> {
    return this.http.delete<Duenio>(`${environment.url_ms_business}/duenios/${id}`);
  }

  view(id: number): Observable<Duenio> {
    return this.http.get<Duenio>(`${environment.url_ms_business}/duenios/${id}`);
  }

  create(duenios: Duenio): Observable<Duenio> {
    delete duenios.id;
    return this.http.post<Duenio>(`${environment.url_ms_business}/duenios`, duenios);
  }

  update(duenios: Duenio): Observable<Duenio> {
    return this.http.put<Duenio>(`${environment.url_ms_business}/duenios/${duenios.id}`, duenios);
  }
}
  