import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LampService {
  private apiUrl = 'http://localhost:8080/api/lampadas';

  constructor(private http: HttpClient) {}

  setLampadaTipo(tipo: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/tipo/${tipo}`, {});
  }

  getDadosPorTipo(tipo: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/dados/${tipo}`);
  }

  salvarDados(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dados/salvar`);
  }
}
