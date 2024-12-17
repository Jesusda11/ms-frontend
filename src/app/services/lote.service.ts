import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lote } from '../models/lote.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoteService {

  constructor(private http: HttpClient) { }

  list(): Observable<Lote[]> {
    return this.http.get<Lote[]>(`${environment.url_ms_business}/lotes`);
    
  }
  delete(id: number) {
    return this.http.delete<Lote>(`${environment.url_ms_business}/lotes/${id}`,
    );
  }

  view(id:number): Observable<Lote> {
    return this.http.get<Lote>(`${environment.url_ms_business}/lotes/${id}`);
  }

  create(lote:Lote): Observable<Lote> {
    delete lote.id
    return this.http.post<Lote>(`${environment.url_ms_business}/lotes`,lote);
  }
  update(lote:Lote): Observable<Lote> {
    return this.http.put<Lote>(`${environment.url_ms_business}/lotes/${lote.id}`,lote);
  }

  listByRoute(ruta_id: number): Observable<Lote[]> {
      return this.http.get<Lote[]>(`${environment.url_ms_business}/lotes?ruta_id=${ruta_id}}`);
    }
  
}
