
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  list(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${environment.url_ms_security}/api/users`);
  }

  delete(id: string): Observable<Usuario> {
    return this.http.delete<Usuario>(`${environment.url_ms_security}/api/users/${id}`);
  }

  view(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${environment.url_ms_security}/api/users/${id}`);
  }

  create(usuarios: Usuario): Observable<Usuario> {
    delete usuarios.id;
    return this.http.post<Usuario>(`${environment.url_ms_security}/api/users`, usuarios);
  }

  update(usuarios: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${environment.url_ms_security}/api/users/${usuarios.id}`, usuarios);
  }
}
  