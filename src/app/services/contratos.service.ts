
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contrato } from '../models/contrato.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContratosService {

  constructor(private http: HttpClient) { }

  list(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${environment.url_ms_business}/contratos`);
  }

  delete(id: number): Observable<Contrato> {
    return this.http.delete<Contrato>(`${environment.url_ms_business}/contratos/${id}`);
  }

  view(id: number): Observable<Contrato> {
    return this.http.get<Contrato>(`${environment.url_ms_business}/contratos/${id}`);
  }

  create(contratos: Contrato): Observable<Contrato> {
    delete contratos.id;
    return this.http.post<Contrato>(`${environment.url_ms_business}/contratos`, contratos);
  }

  update(contratos: Contrato): Observable<Contrato> {
    return this.http.put<Contrato>(`${environment.url_ms_business}/contratos/${contratos.id}`, contratos);
  }
}
  