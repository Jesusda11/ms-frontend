
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  constructor(private http: HttpClient) { }

  list(): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${environment.url_ms_business}/facturas`);
  }

  delete(id: number): Observable<Factura> {
    return this.http.delete<Factura>(`${environment.url_ms_business}/facturas/${id}`);
  }

  view(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${environment.url_ms_business}/facturas/${id}`);
  }

  create(facturas: Factura): Observable<Factura> {
    delete facturas.id;
    return this.http.post<Factura>(`${environment.url_ms_business}/facturas`, facturas);
  }

  update(facturas: Factura): Observable<Factura> {
    return this.http.put<Factura>(`${environment.url_ms_business}/facturas/${facturas.id}`, facturas);
  }
}
  