import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../services/listing.service';
import { MatchService } from '../services/match.service';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { A11yModule } from "@angular/cdk/a11y";
import { MatDialog } from '@angular/material/dialog';
import { ContactMessageDialogComponent } from '../contact-message-dialog-component/contact-message-dialog-component';
import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';
import { FirstLetterPipe } from "../shared/first-letter-pipe";
import { DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-listing-details',
  standalone: true,
  imports: [MatIcon, MatIconModule, A11yModule, FirstLetterPipe, DatePipe, MatProgressSpinnerModule],
  templateUrl: './listing-details.html',
  styleUrl: './listing-details.css',
})
export class ListingDetails {

  /*
  onContactDetail(arg0: number) {
    console.log('Contact detail clicked for listing ID:', arg0);
  }*/

  private route = inject(ActivatedRoute);
  private listingService = inject(ListingService);
  trip: any;

  isLoading = false; // varaible pour gerer le chargement des voyages (spinner)

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private matchService: MatchService,
    private messageService: MessageService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;

    const listingId = Number(this.route.snapshot.paramMap.get('id'));

    this.listingService.getListingById(listingId).subscribe({
      next: (data) => {
        this.trip = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching listing details', err);
        this.isLoading = false;
      }
    });
  }

  onContact() {
    this.matchService.contactTransporter(this.trip.id).subscribe({
      next: (match) => {
        // Navigate to chat with the match ID
        this.router.navigate(['/chat', match.id]);
      },
      error: (err) => {
        /*console.error('Error contacting transporter', err);*/

      }
    });
  }

  onContact2() {
    // Placeholder for contact logic
    this.router.navigate(['/chat', this.trip.id]);
  }

  onContactClick() {
    // ✅ 1. Vérifier si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      // Redirection vers login avec returnUrl
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return; // ⛔ on n'ouvre PAS le dialog
    }

    const ref = this.dialog.open(ContactMessageDialogComponent, {
      width: '520px',
      maxWidth: '95vw',
      data: { title: this.trip.transporter.firstName, placeholder: this.trip.destCity, date: this.trip.departDate },
    });

    ref.afterClosed().subscribe((message: string | null) => {
      if (!message) return; // Annulé

      this.matchService.contactTransporter(this.trip.id).subscribe({
        next: (match) => {
          this.sendMessage(message, match.id);
          this.router.navigate(['/messages']);
        },
        error: (err) => {
          /*console.error('Error contacting transporter', err);*/
        }
      });
    });
  }

  sendMessage(message: string, matchId: number) {
    const text = message.trim();
    if (!text) return;

    if (!matchId || matchId <= 0) {
      return;
    }; // valider matchId; si invalide, ne rien faire

    this.messageService.send(matchId, text).subscribe({
      next: (saved) => {
      },
      error: (err) => console.error(err)
    });
  }

  onBackToListing() {
    this.router.navigate(['/listings']);
  }

}