import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Competitor {
  _id: string;
  nombre: string;
  whatsapp: string;
  ubicacion: string;
  imagen: string;
  descripcion: string;
  activo: boolean;
  orden: number;
}

@Injectable({
  providedIn: 'root'
})
export class CompetitorService {
  private apiUrl = 'http://localhost:3020/api/competitors';

  constructor(private http: HttpClient) {}

  getCompetitors(): Observable<Competitor[]> {
    return this.http.get<Competitor[]>(`${this.apiUrl}/getAll`);
  }
}