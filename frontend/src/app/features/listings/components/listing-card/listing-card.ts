import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FirstLetterPipe } from "../../../../shared/first-letter-pipe";
import { TransporterTrip } from '../../../../model/transporterTrip.model';

@Component({
  selector: 'app-listing-card',
  standalone: true,
  imports: [FirstLetterPipe],
  templateUrl: './listing-card.html',
  styleUrl: './listing-card.css',
})
export class ListingCard {

  @Input({ required: true }) listing!: TransporterTrip;
  @Output() cardClick = new EventEmitter<number>();

  onCardClick(): void {
    if (this.listing?.id) {
      this.cardClick.emit(this.listing.id);
    }
  }

}
