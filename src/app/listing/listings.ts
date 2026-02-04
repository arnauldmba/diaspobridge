import { Component, NgModule, OnInit } from '@angular/core';
import { TransporterTrip } from '../model/transporterTrip.model';
import { ListingService } from '../services/listing.service';
import { CountrySearchCriteria } from '../model/country-search-criteria.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FirstLetterPipe } from '../shared/first-letter-pipe';
import { getAvatarColor } from '../shared/utils/avatar-color.util';
import { futureDatesOnly } from '../shared/utils/date-filters.util';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';


@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCardModule, MatTabsModule,
    MatButtonModule, MatInputModule, MatFormFieldModule, MatStepperModule, MatDatepickerModule, FirstLetterPipe, MatChipsModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './listings.html',
  styleUrl: './listings.css',
})
export class Listings implements OnInit {

  today = new Date();
  futureDatesOnly = futureDatesOnly;

  listings!: TransporterTrip[];

  pickupCity: string = '';
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
    size: 10,
    activeOnly: true
  };

  constructor(private listingService: ListingService, private router: Router) { }

  ngOnInit(): void {
    this.loadAllTrips();
  }

  openListing(id: number | undefined) {
    this.router.navigate(['/listing-details/', id]);
  }

  loadAllTrips(): void {
    const criteria: CountrySearchCriteria = {
      page: 0,
      size: this.size,
      activeOnly: true
    };
    this.fetch(criteria);
  }

  onSearch(): void {
    const criteria: CountrySearchCriteria = {
      origin: this.pickupCity?.trim() || undefined,
      fromDate: this.fromDate ? this.toIsoDate(this.fromDate) : undefined,
      toDate: this.toDate ? this.toIsoDate(this.toDate) : undefined,
      page: 0,
      size: this.size,
      activeOnly: true
    };

    if (this.fromDate && this.toDate && this.fromDate > this.toDate) return;

    this.fetch(criteria);
  }

  private fetch(criteria: CountrySearchCriteria): void {
    this.listingService.searchTrips(criteria).subscribe({
      next: (res) => {
        this.listings = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.page = res.number;
        this.size = res.size;
        this.isFirst = res.first;
        this.isLast = res.last;

        this.currentCriteria = { ...criteria, page: this.page, size: this.size };
      },
      error: (err) => console.error('Erreur chargement annonces:', err)
    });
  }

  private toIsoDate(d: Date): string {
    console.log('Converting date to ISO:', d);
    return d.toISOString().slice(0, 10);
  }


  resetFilters(): void {
    this.pickupCity = '';
    this.fromDate = null;
    this.toDate = null;

    this.loadAllTrips();
  }

  avatarColor(name: string | null | undefined): string {
    return getAvatarColor(name);
  }

  prevPage(): void {
    if (this.isFirst) return;
    this.fetch({ ...this.currentCriteria, page: this.page - 1 });
  }

  nextPage(): void {
    if (this.isLast) return;
    this.fetch({ ...this.currentCriteria, page: this.page + 1 });
  }

  changeSize(newSize: number): void {
    this.size = newSize;
    this.fetch({ ...this.currentCriteria, page: 0, size: newSize });
  }
}