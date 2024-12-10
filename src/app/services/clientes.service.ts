
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient) { }

  list(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${environment.url_ms_business}/clientes`);
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${environment.url_ms_business}/clientes/${id}`);
  }

  view(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${environment.url_ms_business}/clientes/${id}`);
  }

  create(clientes: Cliente): Observable<Cliente> {
    delete clientes.id;
    return this.http.post<Cliente>(`${environment.url_ms_business}/clientes`, clientes);
  }

  update(clientes: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${environment.url_ms_business}/clientes/${clientes.id}`, clientes);
  }
}
  