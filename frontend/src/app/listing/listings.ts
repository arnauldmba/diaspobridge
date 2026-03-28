import { Component, OnInit } from '@angular/core';
import { TransporterTrip } from '../model/transporterTrip.model';
import { ListingService } from '../services/listing.service';
import { CountrySearchCriteria } from '../model/country-search-criteria.model';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideNativeDateAdapter } from '@angular/material/core';

import { FirstLetterPipe } from '../shared/first-letter-pipe';
import { getAvatarColor } from '../shared/utils/avatar-color.util';
import { futureDatesOnly } from '../shared/utils/date-filters.util';

import { Footer } from '../footer/footer/footer';
import { SeachBar } from '../shared/components/seach-bar/seach-bar';
import { ListingCard } from "../features/listings/components/listing-card/listing-card";
import { ListingList } from "../features/listings/components/listing-list/listing-list";

@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatStepperModule,
    MatDatepickerModule,
    FirstLetterPipe,
    MatChipsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    Footer,
    SeachBar,
    ListingList
],
  providers: [provideNativeDateAdapter()],
  templateUrl: './listings.html',
  styleUrl: './listings.css',
})
export class Listings implements OnInit {
  selectedFilter = 1;

  isLoading = false;
  isThereResult = false;
  searchResult = '';

  today = new Date();
  futureDatesOnly = futureDatesOnly;

  listings: TransporterTrip[] = [];

  pickupCity: string | null = null;
  fromDate: Date | null = null;
  toDate: Date | null = null;

  page = 0;
  size = 12;
  totalPages = 0;
  totalElements = 0;
  isFirst = true;
  isLast = false;

  private currentCriteria: CountrySearchCriteria = {
    page: 0,
    size: 12,
    activeOnly: true
  };

  constructor(
    private listingService: ListingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const dest = params['dest'] || undefined;
      const fromDate = params['fromDate'] || undefined;
      const toDate = params['toDate'] || undefined;
      const page = params['page'] ? Number(params['page']) : 0;
      const size = params['size'] ? Number(params['size']) : this.size;

      this.pickupCity = dest ?? null;
      this.fromDate = fromDate ? new Date(fromDate) : null;
      this.toDate = toDate ? new Date(toDate) : null;
      this.size = size;

      const hasSearch = !!dest || !!fromDate || !!toDate;

      if (hasSearch) {
        const criteria: CountrySearchCriteria = {
          dest,
          fromDate,
          toDate,
          page,
          size,
          activeOnly: true
        };

        this.searchResult = this.buildSearchLabelFromParams(dest, fromDate, toDate);
        this.isThereResult = true;
        this.fetch(criteria);
      } else {
        this.isThereResult = false;
        this.searchResult = '';
        this.fetch({
          page,
          size,
          activeOnly: true
        });
      }
    });
  }

  openListing(id: number | undefined): void {
    if (!id) return;
    this.router.navigate(['/listing-details', id]);
  }

  resetFilters(): void {
    this.selectedFilter = 1;

    this.router.navigate(['/listings'], {
      queryParams: {
        dest: null,
        fromDate: null,
        toDate: null,
        page: 0,
        size: this.size
      },
      queryParamsHandling: 'merge'
    });
  }

  prevPage(): void {
    if (this.isFirst) return;
    this.updateQueryParams({ page: this.page - 1 });
  }

  nextPage(): void {
    if (this.isLast) return;
    this.updateQueryParams({ page: this.page + 1 });
  }

  changeSize(newSize: number): void {
    this.size = newSize;
    this.updateQueryParams({ page: 0, size: newSize });
  }

  selectFilter(days: number): void {
    this.selectedFilter = days;

    if (days === 1) {
      this.resetFilters();
      return;
    }

    const fromDate = new Date();
    const toDate = new Date();
    toDate.setDate(toDate.getDate() + days);

    this.router.navigate(['/listings'], {
      queryParams: {
        dest: this.pickupCity?.trim() || null,
        fromDate: this.toIsoDateLocal(fromDate),
        toDate: this.toIsoDateLocal(toDate),
        page: 0,
        size: this.size
      }
    });
  }

  private fetch(criteria: CountrySearchCriteria): void {
    this.isLoading = true;

    this.listingService.searchTrips(criteria).subscribe({
      next: (res) => {
        this.listings = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.page = res.number;
        this.size = res.size;
        this.isFirst = res.first;
        this.isLast = res.last;

        this.currentCriteria = {
          ...criteria,
          page: this.page,
          size: this.size
        };

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement annonces:', err);
        this.isLoading = false;
      }
    });
  }

  private updateQueryParams(params: Record<string, string | number | null>): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge'
    });
  }

  private buildSearchLabelFromParams(
    dest?: string,
    fromDate?: string,
    toDate?: string
  ): string {
    const parts: string[] = [];

    if (dest) {
      parts.push(dest);
    }

    if (fromDate) {
      parts.push(this.formatDateLabel(fromDate));
    }

    if (toDate) {
      parts.push(`- ${this.formatDateLabel(toDate)}`);
    }

    return parts.join(' ').trim();
  }

  private formatDateLabel(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
  }

  private toIsoDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}