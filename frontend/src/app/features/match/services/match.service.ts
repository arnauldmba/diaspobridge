import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MatchDto } from '../../../model/chat.models';

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