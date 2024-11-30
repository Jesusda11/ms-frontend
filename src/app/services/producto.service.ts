import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http: HttpClient) { }

  list(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${environment.url_ms_business}/productos`);
    
  }
  delete(id: number) {
    return this.http.delete<Producto>(`${environment.url_ms_business}/productos/${id}`,
    );
  }

  view(id:number): Observable<Producto> {
    return this.http.get<Producto>(`${environment.url_ms_business}/productos/${id}`);
  }

  create(producto:Producto): Observable<Producto> {
    delete producto.id
    return this.http.post<Producto>(`${environment.url_ms_business}/productos`,producto);
  }
  update(producto:Producto): Observable<Producto> {
    return this.http.put<Producto>(`${environment.url_ms_business}/productos/${producto.id}`,producto);
  }
}
