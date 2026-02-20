import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageDto } from '../model/message-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';
import { Subscription, switchMap, timer } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { FirstLetterPipe } from "../shared/first-letter-pipe";


@Component({
  selector: 'app-chat-messaging',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule, FirstLetterPipe],
  templateUrl: './chat-messaging.html',
  styleUrl: './chat-messaging.css',
})

export class ChatMessaging implements OnChanges, OnInit{

  @Input({ required: true }) matchId!: number;

  messages: MessageDto[] = [];
  draft = '';
  curruntUser = 0 ;

  private lastSinceIso = new Date(0).toISOString();
  private sub?: Subscription;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
  ) { }

  private initChat(id: number){
    // stop ancien polling si on change de match
    this.sub?.unsubscribe();

    this.matchId = id;
    this.messages = []; 
    this.lastSinceIso = new Date(0).toISOString();

    this.loadMessages();
    this.startPolling();
  }

  ngOnInit(): void {
    this.authService.loadToken();
    this.curruntUser = this.authService.logedUserId ?? 0;

    if (this.matchId && this.matchId > 0){
      this.initChat(this.matchId);
    }

    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('matchId'));
      if(!id || id <= 0) return; 

      this.initChat(id);
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!changes['matchId']) return;

    this.sub?.unsubscribe(); // arrêter l'ancien abonnement s'il existe

    if(!this.matchId || this.matchId <= 0){
      console.error('Invalid matchId provided to ChatMessaging:', this.matchId);
      return;
    }; 

    this.messages = []; // réinitialiser les messages
    this.lastSinceIso = new Date(0).toISOString(); // réinitialiser lastSinceIso

    this.loadMessages();
    this.startPolling();  
  }

  loadMessages() {
    this.messageService.list(this.matchId).subscribe({
      next: (msgs) => this.messages = msgs,
      error: (err) => console.error(err)
    });
    console.log("Liste de match: ", this.messages);
  }

  onSend() {
    const text = this.draft.trim();
    if (!text) return;

    if(!this.matchId || this.matchId <= 0){
      console.error('Invalid matchId provided to ChatMessaging:', this.matchId);
      return;
    }; // valider matchId; si invalide, ne rien faire

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
    const id = this.matchId;

    this.sub = timer(0, 2000)
      .pipe(switchMap(() => this.messageService.getNewMessages(id, this.lastSinceIso)))
      .subscribe({
        next: (newMsgs) => {
          if (!newMsgs.length) return;

          const existing = new Set(this.messages.map((m) => m.id));
          const toAdd = newMsgs.filter((m) => !existing.has(m.id));

          this.messages = [...this.messages, ...toAdd];
          this.lastSinceIso = newMsgs[newMsgs.length - 1].sentAt;
        },
        error: (err) => console.error(err),
      });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  onReturntoMatchList(){
    this.router.navigate(['/messages']);
  }
}
