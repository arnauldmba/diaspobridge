import { Component } from '@angular/core';
import { MatchService } from '../services/match.service';
import { MatchDto } from '../model/chat.models';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChatMessaging } from '../chat-messaging/chat-messaging';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-my-matches',
  imports: [CommonModule, ChatMessaging, MatIconModule],
  templateUrl: './my-matches.html',
  styleUrl: './my-matches.css',
})
export class MyMatches {

  matchIdParent!: number;

  myMatches: MatchDto[] = [];
  firstMatchiD!: number;
  actuellUser?: string;


  constructor(private matchService: MatchService, private router: Router) { }

  ngOnInit() {
    this.matchService.getMyMatches().subscribe({
      next: (matches) => {
        this.myMatches = matches;
        if (matches.length > 0) {
          this.matchIdParent = matches[0].id; // ou matches[0].matchId selon ton DTO
          this.actuellUser = matches[0].otherFirstName;
        }
        console.log("tout premier match", this.myMatches[0]); // ✅ ici
      },
      error: (err) => console.error(err),
    });
  }

  getFirstLetter(name: string | null | undefined): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }

  onOpenChat(matchId: number) {
    console.log('onOpenChat matchId parent: ', matchId);
    this.matchIdParent = matchId;
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
}