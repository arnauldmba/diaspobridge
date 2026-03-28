import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseCity } from '../../../../shared/models/cities-model';
import { CityDataService } from '../../../../shared/services/city-data.services';
import { CityAutocompleteComponent } from '../../../../shared/components/city-autocomplete-component/city-autocomplete-component';

@Component({
  selector: 'app-seach-bar',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatDatepickerModule, CityAutocompleteComponent, FormsModule],
  templateUrl: './seach-bar.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './seach-bar.css',
})
export class SeachBar {
  @ViewChild('destinationInput') destinationInput?: ElementRef<HTMLInputElement>;

  showSearchOverlay = false;

  destination = '';
  startDate: Date | null = null;
  endDate: Date | null = null;

  cities: BaseCity[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cityDataService: CityDataService
  ) {
    this.route.queryParams.subscribe(params => {
      this.destination = params['dest'] || '';
      this.startDate = params['fromDate'] ? new Date(params['fromDate']) : null;
      this.endDate = params['toDate'] ? new Date(params['toDate']) : null;
    });
  }

  ngOnInit(): void {
    this.cities = this.cityDataService.getAllCities();
  }

  get searchSummary(): string {
    const parts: string[] = [];

    if (this.destination?.trim()) {
      parts.push(this.destination.trim());
    }

    const dateRange = this.getDateRangeText();
    if (dateRange) {
      parts.push(dateRange);
    }

    return parts.join(' • ');
  }

  openSearchOverlay(): void {
    this.showSearchOverlay = true;
    document.body.classList.add('no-scroll');

    setTimeout(() => {
      this.destinationInput?.nativeElement.focus();
    }, 100);
  }

  closeSearchOverlay(): void {
    this.showSearchOverlay = false;
    document.body.classList.remove('no-scroll');
  }

  resetSearchForm(): void {
    this.destination = '';
    this.startDate = null;
    this.endDate = null;
    this.submitSearch();
  }

  submitSearch(): void {
    this.closeSearchOverlay();

    this.router.navigate(['/listings'], {
      queryParams: {
        dest: this.destination.trim() || null,
        fromDate: this.startDate ? this.toIsoDate(this.startDate) : null,
        toDate: this.endDate ? this.toIsoDate(this.endDate) : null,
        page: 0,
        size: 12
      }
    });
  }

  private getDateRangeText(): string {
    if (!this.startDate && !this.endDate) {
      return '';
    }

    const format = (date: Date) =>
      new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'short'
      }).format(date);

    if (this.startDate && this.endDate) {
      return `${format(this.startDate)} - ${format(this.endDate)}`;
    }

    if (this.startDate) {
      return `${format(this.startDate)}`;
    }

    return '';
  }

  private toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
