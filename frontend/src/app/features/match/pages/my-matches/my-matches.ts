import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { Subscription } from 'rxjs';
import { FirstLetterPipe } from '../../../../shared/first-letter-pipe';
import { MatchDto } from '../../../../model/chat.models';
import { MessageService } from '../../services/message.service';
import { UnreadMessagesService } from '../../../../core/services/unread-messages.service';

@Component({
  selector: 'app-my-matches',
  imports: [
    CommonModule,
    MatIconModule,
    FirstLetterPipe,
    MatProgressSpinnerModule,
    MatBadgeModule,
  ],
  templateUrl: './my-matches.html',
  styleUrl: './my-matches.css',
})
export class MyMatches implements OnInit, OnDestroy {
  private readonly unreadMessagesService = inject(UnreadMessagesService);

  private sub?: Subscription;

  matchIdParent!: number;

  isLoading = false;
  myMatches: MatchDto[] = [];
  showMessage = false;

  constructor(
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.sub = this.unreadMessagesService.matches$.subscribe({
      next: (matches) => {
        this.myMatches = matches;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });

    this.unreadMessagesService.startPolling();
  }

  onOpenChat2(matchId: number, firstname?: string): void {
    this.matchIdParent = matchId;
    this.showMessage = true;

    this.router.navigate(['/chat', matchId], {
      queryParams: { name: firstname ?? '' },
    });

    this.messageService.markAsRead(matchId).subscribe({
      next: () => {
        const updatedMatches = this.myMatches.map((match) =>
          match.id === matchId ? { ...match, unreadCount: 0 } : match
        );

        this.myMatches = updatedMatches;
        this.unreadMessagesService.refresh();
      },
      error: (err) => console.error('markAsRead failed', err),
    });
  }

  formatMessageDate(sentAt: string | Date): string {
    const d = new Date(sentAt);

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMsgDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const diffDays = Math.round(
      (startOfToday.getTime() - startOfMsgDay.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';

    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();

    return `${dd}.${mm}.${yyyy}`;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}