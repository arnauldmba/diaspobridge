import { Injectable, OnDestroy, inject } from '@angular/core';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatchDto } from '../../model/chat.models';
import { MatchService } from '../../features/match/services/match.service';

@Injectable({
  providedIn: 'root'
})
export class UnreadMessagesService implements OnDestroy {
  private readonly matchService = inject(MatchService);

  private readonly matchesSubject = new BehaviorSubject<MatchDto[]>([]);
  readonly matches$ = this.matchesSubject.asObservable();

  private readonly totalUnreadSubject = new BehaviorSubject<number>(0);
  readonly totalUnread$ = this.totalUnreadSubject.asObservable();

  private pollingSub?: Subscription;

  startPolling(): void {
    if (this.pollingSub) {
      return;
    }

    this.pollingSub = timer(0, 6000)
      .pipe(switchMap(() => this.matchService.getMyMatches()))
      .subscribe({
        next: (matches) => {
          this.matchesSubject.next(matches);

          const totalUnread = matches.reduce(
            (sum, match) => sum + (match.unreadCount ?? 0),
            0
          );

          this.totalUnreadSubject.next(totalUnread);
        },
        error: (err) => {
          console.error('UnreadMessagesService polling error:', err);
        }
      });
  }

  stopPolling(): void {
    this.pollingSub?.unsubscribe();
    this.pollingSub = undefined;
    this.matchesSubject.next([]);
    this.totalUnreadSubject.next(0);
  }

  refresh(): void {
    this.matchService.getMyMatches().subscribe({
      next: (matches) => {
        this.matchesSubject.next(matches);

        const totalUnread = matches.reduce(
          (sum, match) => sum + (match.unreadCount ?? 0),
          0
        );

        this.totalUnreadSubject.next(totalUnread);
      },
      error: (err) => {
        console.error('UnreadMessagesService refresh error:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }
}