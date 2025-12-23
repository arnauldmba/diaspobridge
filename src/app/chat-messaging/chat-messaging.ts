import { Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageDto } from '../model/message-dto';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';
import { Subscription, switchMap, timer } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chat-messaging',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule],
  templateUrl: './chat-messaging.html',
  styleUrl: './chat-messaging.css',
})

export class ChatMessaging implements OnChanges{

  @Input() matchId!: number;
  messages: MessageDto[] = [];
  draft = '';
  curruntUser!: number;
  private lastSinceIso = new Date(0).toISOString();
  private sub?: Subscription;

  constructor(private route: ActivatedRoute,
    private messageService: MessageService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.curruntUser = this.authService.logedUserId!;

    this.route.paramMap.subscribe(pm => {
      this.matchId = Number(pm.get('matchId'));
      if (!this.matchId) return;

      this.startPolling(); // <-- ici seulement
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['matchId'] && this.matchId) {
      this.loadMessages();
      this.startPolling();
    }
  }

  loadMessages() {
    this.messageService.list(this.matchId).subscribe({
      next: (msgs) => this.messages = msgs,
      error: (err) => console.error(err)
    });
  }

  onSend() {
    console.log('Loaded messages for matchId:', this.messages);

    const text = this.draft.trim();
    if (!text) return;

    this.messageService.send(this.matchId, text).subscribe({
      next: (saved) => {
        this.messages = [...this.messages, saved];
        this.draft = '';
      },
      error: (err) => console.error(err)
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
    if (diffDays === 1) return "Hier";

    // format 18.12.2025
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  }


  startPolling() {
    this.sub?.unsubscribe();

    this.sub = timer(0, 2000).pipe(
      switchMap(() =>
        this.messageService.getNewMessages(this.matchId, this.lastSinceIso)
      )
    ).subscribe(newMsgs => {

      if (!newMsgs.length) return;

      const existing = new Set(this.messages.map(m => m.id));
      const toAdd = newMsgs.filter(m => !existing.has(m.id));

      this.messages = [...this.messages, ...toAdd];

      // très important
      this.lastSinceIso = newMsgs[newMsgs.length - 1].sentAt;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }


}
