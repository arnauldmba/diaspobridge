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
import { provideNativeDateAdapter, MatOption } from '@angular/material/core';
import { FirstLetterPipe } from '../shared/first-letter-pipe';
import { getAvatarColor } from '../shared/utils/avatar-color.util';
import { futureDatesOnly } from '../shared/utils/date-filters.util';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { CityAutocompleteComponent } from "../city-autocomplete-component/city-autocomplete-component";
import { CITIES_CM } from '../model/cities-cm';


@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCardModule, MatTabsModule,
    MatButtonModule, MatInputModule, MatFormFieldModule, MatStepperModule, MatDatepickerModule, FirstLetterPipe, MatChipsModule, MatOption, MatSelectModule, CityAutocompleteComponent],
  providers: [provideNativeDateAdapter()],
  templateUrl: './listings.html',
  styleUrl: './listings.css',
})
export class Listings implements OnInit {

  citiesCM = CITIES_CM;


  isCalendarOpen = false;
  selectedDate: Date | null = null;

  closeCalender() {
    this.isCalendarOpen = false;
  }

  selectedPeriod: '7days' | '30days' | 'thisMonth' | 'custom' = '30days';

  today = new Date();
  futureDatesOnly = futureDatesOnly;

  listings!: TransporterTrip[];

  //pickupCity: string = '';
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
    if(this.selectedPeriod === 'custom') {
      this.selectedDate = this.fromDate; 
      console.log('Selected period custom:', this.selectedPeriod, 'From:', this.fromDate, 'To:', this.toDate);  
    }else if(this.selectedPeriod === '7days') {
      console.log('Selected period 7days:', this.selectedPeriod);
      this.fromDate = new Date();
      this.toDate = new Date();
      this.toDate.setDate(this.toDate.getDate() + 7);
    }else if(this.selectedPeriod === 'thisMonth') {
      this.fromDate = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
      this.toDate = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);
      console.log('Selected period thisMonth:', this.selectedPeriod);
    }else if(this.selectedPeriod === '30days') {
      this.fromDate = new Date();
      this.toDate = new Date();
      this.toDate.setDate(this.toDate.getDate() + 30);
      console.log('Selected period 30days:', this.selectedPeriod);
    }

    const criteria: CountrySearchCriteria = {
      origin: this.pickupCity?.trim() || undefined,
      fromDate: this.fromDate ? this.toIsoDateLocal(this.fromDate) : undefined,
      toDate: this.toDate ? this.toIsoDateLocal(this.toDate) : undefined,
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

private toIsoDateLocal(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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