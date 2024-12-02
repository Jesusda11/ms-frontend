import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empresa } from '../models/empresa.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private http: HttpClient) { }

  list(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${environment.url_ms_business}/empresas`);
    
  }
  delete(id: number) {
    return this.http.delete<Empresa>(`${environment.url_ms_business}/empresas/${id}`,
    );
  }

  view(id:number): Observable<Empresa> {
    return this.http.get<Empresa>(`${environment.url_ms_business}/empresas/${id}`);
  }

  create(empresa:Empresa): Observable<Empresa> {
    delete empresa.id
    return this.http.post<Empresa>(`${environment.url_ms_business}/empresas`,empresa);
  }
  update(empresa:Empresa): Observable<Empresa> {
    return this.http.put<Empresa>(`${environment.url_ms_business}/empresas/${empresa.id}`,empresa);
  }
}
