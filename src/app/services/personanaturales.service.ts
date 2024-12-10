
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Personanatural } from '../models/personanatural.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonanaturalesService {

  constructor(private http: HttpClient) { }

  list(): Observable<Personanatural[]> {
    return this.http.get<Personanatural[]>(`${environment.url_ms_cinema}/personasnaturales`);
  }

  delete(id: number): Observable<Personanatural> {
    return this.http.delete<Personanatural>(`${environment.url_ms_cinema}/personasnaturales/${id}`);
  }

  view(id: number): Observable<Personanatural> {
    return this.http.get<Personanatural>(`${environment.url_ms_cinema}/personasnaturales/${id}`);
  }

  create(personanaturales: Personanatural): Observable<Personanatural> {
    delete personanaturales.id;
    return this.http.post<Personanatural>(`${environment.url_ms_cinema}/personasnaturales`, personanaturales);
  }

  update(personanaturales: Personanatural): Observable<Personanatural> {
    return this.http.put<Personanatural>(`${environment.url_ms_cinema}/personasnaturales/${personanaturales.id}`, personanaturales);
  }
}
  