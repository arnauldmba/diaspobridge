import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListingCard } from "../listing-card/listing-card";
import { TransporterTrip } from '../../../../model/transporterTrip.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ListingSkeleton } from '../app-listing-skeleton/listing-skeleton';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-listing-list',
  standalone: true,
  imports: [
    CommonModule,
    ListingSkeleton,
    MatProgressSpinnerModule,
    MatButtonModule,
    ListingCard,
    TranslatePipe],
  templateUrl: './listing-list.html',
  styleUrl: './listing-list.css',
})
export class ListingList {

  @Input() listings: TransporterTrip[] = [];
  @Input() isLoading = false;

  @Input() page = 0;
  @Input() totalPages = 0;
  @Input() isFirst = true;
  @Input() isLast = false;
  @Input() size = 12;
  @Input() totalElements = 0;

  @Output() listingClick = new EventEmitter<number>();
  @Output() prevPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();
  @Output() sizeChange = new EventEmitter<number>();

  onCardClick(id: number): void {
    this.listingClick.emit(id);
  }

  onSizeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.sizeChange.emit(Number(value));
  }
}
