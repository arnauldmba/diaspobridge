import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-listing-filters',
  imports: [CommonModule],
  templateUrl: './listing-filters.html',
  styleUrl: './listing-filters.css',
})
export class ListingFilters {
  @Input() selectedFilter = 1;
  @Output() filterSelected = new EventEmitter<number>(); 

  filterOptions = [7, 15, 30];

  selectFilter(days: number): void {
    this.filterSelected.emit(days);
  }
}