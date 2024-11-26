import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Theater } from '../models/theater.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TheaterService {

  constructor(private http: HttpClient) { }

  list(): Observable<Theater[]> {
    return this.http.get<Theater[]>(`${environment.url_ms_cinema}/theaters`);
  }
  delete(id: number) {
    return this.http.delete<Theater>(`${environment.url_ms_cinema}/theaters/${id}`,
    );
  }

  view(id:number): Observable<Theater> {
    return this.http.get<Theater>(`${environment.url_ms_cinema}/theaters/${id}`);
  }
  create(theater:Theater): Observable<Theater> {
    delete theater.id
    return this.http.post<Theater>(`${environment.url_ms_cinema}/theaters`,theater);
  }
  update(theater:Theater): Observable<Theater> {
    return this.http.put<Theater>(`${environment.url_ms_cinema}/theaters/${theater.id}`,theater);
  }
}
