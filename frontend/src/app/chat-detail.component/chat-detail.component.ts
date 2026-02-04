import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatMessaging } from "../chat-messaging/chat-messaging";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-detail.component',
  standalone: true,
  imports: [ChatMessaging, CommonModule],
  templateUrl: './chat-detail.component.html',
  styleUrl: './chat-detail.component.css',
})
export class ChatDetailComponent {

  matchId: number | null = null;
  
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const raw = this.route.snapshot.paramMap.get('matchId');
    const id = raw ? Number(raw) : NaN;
    this.matchId = Number.isFinite(id) && id > 0 ? id : null;
  }
}
