import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminDashboardStats } from '../page/dashboard/models/admin-dashboard-stats.model';
import { User } from '../../../model/users.model';
import { TransporterTrip } from '../../../model/transporterTrip.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  //private apiUrl = 'http://localhost:8080/diasporabridge/api/admin';
  private apiUrl: string = environment.apiUrl;

  getDashboardStats(): Observable<AdminDashboardStats> {
    return this.http.get<AdminDashboardStats>(`${this.apiUrl}/admin/dashboard/stats`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users/all`);
  }

  activkUser(userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/admin/users/${userId}/enable`, {});
  }

  deactivkUser(userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/admin/users/${userId}/disable`, {});
  }

  /*
  blockUser(userId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/users/${userId}/block`, {});
  }

  unblockUser(userId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/users/${userId}/unblock`, {});
  }
  */

  getAllListings(): Observable<TransporterTrip[]> {
    return this.http.get<TransporterTrip[]>(`${this.apiUrl}/admin/trips/all`);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/users/${userId}`);
  }

  restoreUser(userId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/admin/users/${userId}/restore`, {});
  }
  
  hideListing(listingId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/listings/${listingId}/hide`, {});
  }
}