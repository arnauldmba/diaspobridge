import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { A11yModule } from "@angular/cdk/a11y";
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatchService } from '../../../match/services/match.service';
import { MessageService } from '../../../match/services/message.service';
import { ContactMessageDialogComponent } from '../../../../contact-message-dialog-component/contact-message-dialog-component';
import { FirstLetterPipe } from '../../../../shared/first-letter-pipe';
import { AuthService } from '../../../../core/services/auth.service';
import { ListingService } from '../../services/listing.service';
import { TranslatePipe } from '@ngx-translate/core';
import { ListingShareService } from '../../../../shared/services/listing-share.service';
import { HostListener } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { ShareTrip } from '../../components/share-trip/share-trip';

@Component({
  selector: 'app-listing-details',
  standalone: true,
  imports: [
    MatIcon,
    MatIconModule,
    A11yModule,
    FirstLetterPipe,
    DatePipe,
    MatProgressSpinnerModule,
    TranslatePipe,
    FontAwesomeModule,
    ShareTrip
],
  templateUrl: './listing-details.html',
  styleUrl: './listing-details.css',
})
export class ListingDetails implements OnDestroy {

  private route = inject(ActivatedRoute);
  private listingService = inject(ListingService);
  
  trip: any;

  shareMenuOpen = false;
  shareMessage = '';

  private messageTimer?: ReturnType<typeof setTimeout>;

  openShareMenu(): void {
    this.shareMenuOpen = true;
    this.shareMessage = '';
  }

  closeShareMenu(): void {
    this.shareMenuOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.shareMenuOpen) {
      this.closeShareMenu();
    }
  }

  isLoading = false;

  faWhatsapp = faWhatsapp; 

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
    this.router.navigate(['/chat', this.trip.id]);
  }

  onContactClick() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return; 
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
    }; 

    this.messageService.send(matchId, text).subscribe({
      next: (saved) => {
      },
      error: (err) => console.error(err)
    });
  }

  onBackToListing() {
    this.router.navigate(['/listings']);
  }

  onShareFeedback(message: string): void {
    clearTimeout(this.messageTimer);

    this.shareMessage = message;

    this.messageTimer = setTimeout(() => {
      this.shareMessage = '';
    }, 3000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.messageTimer);
  }
}