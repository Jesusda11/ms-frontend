import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conductor } from '../models/conductor.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConductorService {

  constructor(private http: HttpClient) { }

  list(): Observable<Conductor[]> {
    return this.http.get<Conductor[]>(`${environment.url_ms_business}/conductores`);
    
  }
  delete(id: number) {
    return this.http.delete<Conductor>(`${environment.url_ms_business}/conductores/${id}`,
    );
  }

  view(id: number): Observable<Conductor> {
    return this.http.get<Conductor>(`${environment.url_ms_business}/conductores/${id}`);
  }

  create(conductor:Conductor): Observable<Conductor> {
    delete conductor.id
    return this.http.post<Conductor>(`${environment.url_ms_business}/conductores`,conductor);
  }
  update(conductor:Conductor): Observable<Conductor> {
    return this.http.put<Conductor>(`${environment.url_ms_business}/conductores/${conductor.id}`,conductor);
  }
}
