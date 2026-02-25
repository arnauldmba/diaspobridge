import { Component } from '@angular/core';
import { MatchService } from '../services/match.service';
import { MatchDto } from '../model/chat.models';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { getAvatarColor } from '../shared/utils/avatar-color.util';
import { FirstLetterPipe } from "../shared/first-letter-pipe";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-my-matches',
  imports: [CommonModule, MatIconModule, FirstLetterPipe, MatProgressSpinnerModule],
  templateUrl: './my-matches.html',
  styleUrl: './my-matches.css',
})
export class MyMatches {

  //Selected machtid
  matchIdParent!: number;
  selectedId!: number;

  isLoading = false; // varaible pour gerer le chargement des voyages (spinner)

  isMobile = window.matchMedia('(max-width: 600px)').matches;

  myMatches: MatchDto[] = [];
  firstMatchiD!: number;
  actuellUser?: string;
  showMessage = false;


  constructor(
    private matchService: MatchService,
    private router: Router) { }

  ngOnInit() {
    this.isLoading = true; 

    this.matchService.getMyMatches().subscribe({
      next: (matches) => {
        this.myMatches = matches;
        this.isLoading = false; 
        if (matches.length > 0) {
          //const first = matches[0];  // take first match 
          //this.onOpenChat(first.id, first.otherFirstName); // open first match
        }
        console.log("tout premier match", this.myMatches[0]); // ✅ ici
      },
      error: (err) => {
        console.error(err); 
        this.isLoading = false; 
      }
    });
  }

  getFirstLetter(name: string | null | undefined): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }

  onOpenChat2(matchId: number, firstname?: string) {
    this.router.navigate(['/chat', matchId], {
      queryParams: { name: firstname ?? ''}
    });
  }

  /*
  * ouvrer le chat dans un composant
  */
  onOpenChat4(matchId: number, firstname?: string) {
    this.matchIdParent = matchId;
    this.actuellUser = firstname;
    this.router.navigate(['/chat', matchId]);
    if (window.innerWidth <= 600) {
      this.showMessage = true;
    }
  }

  onBackToListing() {
    this.router.navigate(['/listings']);
  }


  onOpenChat(id: number) {
    if (this.isMobile) {
      this.router.navigate(['/chat', id]);
    } else {
      this.selectedId = id;
    }
  }

  openChat(matchId: number) {
    this.router.navigate(['/chat', matchId]);
  }

  onCloseChat() {
    if (window.innerWidth <= 600) {
      this.showMessage = false;
    }
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

  avatarColor(name: string | null | undefined): string {
    return getAvatarColor(name);
  }
}