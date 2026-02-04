import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatchDto } from '../model/chat.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MatchService {
  //private baseUrl = 'http://localhost:8080/diasporabridge/api';
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  contactTransporter(tripId: number): Observable<MatchDto> {
    return this.http.post<MatchDto>(`${this.baseUrl}/trip/${tripId}/matches`, {});
  }

  getMyMatches(): Observable<MatchDto[]> {
    return this.http.get<MatchDto[]>(`${this.baseUrl}/matches/my`);
  }
}