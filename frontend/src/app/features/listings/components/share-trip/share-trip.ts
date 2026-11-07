import { Component, EventEmitter, Input, Output, OnDestroy, inject, HostListener } from '@angular/core';
import { ListingShareService } from '../../../../shared/services/listing-share.service';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TransporterTrip } from '../../../../model/transporterTrip.model';

@Component({
  selector: 'app-share-trip',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './share-trip.html',
  styleUrl: './share-trip.css',
})
export class ShareTrip {

  @Input({ required: true })
  trip!: TransporterTrip;

  @Output()
  closed = new EventEmitter<void>();

  @Output()
  feedback = new EventEmitter<string>();

  faWhatsapp = faWhatsapp;
  faXmark = faXmark;

  private listingShareService = inject(ListingShareService);

  closeShareMenu(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeShareMenu();
  }

  shareOnWhatsApp(): void {
    if (!this.trip) return;

    const url = this.listingShareService
      .getWhatsAppUrl(this.trip);

    window.open(url, '_blank', 'noopener,noreferrer');

    this.closeShareMenu();
  }

  async shareOtherApps(): Promise<void> {
    if (!this.trip) return;

    try {
      const result = await this.listingShareService
        .shareTrip(this.trip);

      if (result === 'copied') {
        this.feedback.emit('Message copié !');
        this.closeShareMenu();

      } else if (result === 'shared') {
        this.closeShareMenu();
      }

    } catch (error) {
      console.error('Erreur de partage :', error);
      this.feedback.emit('Impossible de partager cette annonce.');
    }
  }

  async copyTripLink(): Promise<void> {
    if (!this.trip) return;

    try {
      await this.listingShareService.copyTripLink(this.trip);

      this.feedback.emit('Lien copié !');
      this.closeShareMenu();

    } catch (error) {
      console.error('Erreur de copie :', error);
      this.feedback.emit('Impossible de copier le lien.');
    }
  }
}