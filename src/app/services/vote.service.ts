// services/vote.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VoteData {
  nombreCompleto: string;
  cedula: string;
  telefono: string;
  correo: string;
  selectedOption: number; // Changed to number to match backend
}

export interface VoteResponse {
  message: string;
  vote: any;
}

export interface StatisticsResponse {
  totalVotes: number;
  results: Array<{
    option: number;
    optionName: string;
    votes: number;
    percentage: string;
  }>;
  winner: any;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  private apiUrl = 'ttps://api.crunchy-munch.com/api/vote';

  constructor(private http: HttpClient) {}

  // Crear un nuevo voto
  createVote(voteData: VoteData): Observable<VoteResponse> {
    return this.http.post<VoteResponse>(`${this.apiUrl}`, voteData); // Fixed endpoint
  }

  // Verificar si una cédula ya ha votado
  checkVote(cedula: string): Observable<{cedula: string, hasVoted: boolean}> {
    return this.http.get<{cedula: string, hasVoted: boolean}>(`${this.apiUrl}/check/${cedula}`);
  }

  // Obtener estadísticas
  getStatistics(): Observable<StatisticsResponse> {
    return this.http.get<StatisticsResponse>(`${this.apiUrl}/statistics`);
  }

  // Obtener todos los votos (admin)
  getAllVotes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`); // Fixed endpoint
  }
}