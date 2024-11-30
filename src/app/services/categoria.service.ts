import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) { }

  list(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${environment.url_ms_business}/categorias`);
    
  }
  delete(id: number) {
    return this.http.delete<Categoria>(`${environment.url_ms_business}/categorias/${id}`,
    );
  }

  view(id:number): Observable<Categoria> {
    return this.http.get<Categoria>(`${environment.url_ms_business}/categorias/${id}`);
  }

  create(categoria:Categoria): Observable<Categoria> {
    delete categoria.id
    return this.http.post<Categoria>(`${environment.url_ms_business}/categorias`,categoria);
  }
  update(categoria:Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${environment.url_ms_business}/categorias/${categoria.id}`,categoria);
  }
}
