import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, timer } from 'rxjs';
import { MessageDto } from '../model/message-dto';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MessageService {
  //private baseUrl = 'http://localhost:8080/diasporabridge/api';
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  list(matchId: number): Observable<MessageDto[]> {
    return this.http.get<MessageDto[]>(`${this.baseUrl}/messages/matches/${matchId}/messages`);
  }

  send(matchId: number, body: string): Observable<MessageDto> {
    return this.http.post<MessageDto>(`${this.baseUrl}/messages/matches/${matchId}/messages`, { body });
  }

  getNewMessages(matchId: number, sinceIso: string) {
    return this.http.get<MessageDto[]>(`${this.baseUrl}/messages/matches/${matchId}/messages/new`,{ params: { since: sinceIso } }
    );
  }

  markAsRead(matchId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/messages/matches/${matchId}/read`, {});
  }

  markAsRead2(matchId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/matches/${matchId}/messages/read`, {});
  }
}