import { Component, OnInit } from '@angular/core';
import { TransporterTrip } from '../model/transporterTrip.model';
import { ListingService } from '../services/listing.service';
import { CountrySearchCriteria } from '../model/country-search-criteria.model';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { MatSelectModule } from '@angular/material/select';
import { CityAutocompleteComponent } from "../shared/components/city-autocomplete-component/city-autocomplete-component";
import { CITIES_CM } from '../shared/data/cities-cm';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ALL_CITIES } from '../shared/data/cities-all';
import { Footer } from "../footer/footer/footer";
import { SeachBar } from "../shared/components/seach-bar/seach-bar";


@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCardModule, MatTabsModule,
    MatButtonModule, MatStepperModule, MatDatepickerModule, FirstLetterPipe, MatChipsModule, MatSelectModule, CityAutocompleteComponent, MatProgressSpinnerModule, Footer, SeachBar],
  providers: [provideNativeDateAdapter()],
  templateUrl: './listings2.html',
  styleUrl: './listings.css',
})
export class Listings2 implements OnInit {
// version 2
    errorMessage = '';

  selectedFilter: number = 1;

  isFocused: boolean = false;

  dateInteracted = false;

  isLoading = false; // variable pour afficher le spinner (lorsque la page charge les voyages)

  isThereResult: boolean = false; //Vaiable pour afficher et cacher le button: Effacer la recherche

  seachResutat: string = ''; // variable qui contient le resutlat de la recherche

  citiesCM = CITIES_CM;

  readonly selectedPeriodList: {name:string , value: string}[] = [{name: '7days', value: 'Prochains 7 jours'}, {name: 'thisMonth', value: 'Ce mois-ci'}, {name: '30days', value: '30 jours'}];
  selectedPeriod: string = '';
  today = new Date();
  futureDatesOnly = futureDatesOnly;

  listings!: TransporterTrip[];

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

  constructor(private route: ActivatedRoute, private listingService: ListingService, private router: Router) { }

  ngOnInit(): void {
    //this.loadAllTrips();
    this.route.queryParams.subscribe(params => {
      const criteria: CountrySearchCriteria = {
        dest: params['dest'] || undefined,
        fromDate: params['fromDate'] || undefined,
        toDate: params['toDate'] || undefined,
        page: params['page'] ? Number(params['page']) : 0,
        size: 10,
        activeOnly: true
      };

      const hasSearch =
        !!criteria.dest || !!criteria.fromDate || !!criteria.toDate;

      if (hasSearch) {
        this.loadSearchResults(criteria);
      } else {
        this.loadAllListings();
      }
    });
  }

  loadAllListings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.listingService.getAllListings().subscribe({
      next: (data) => {
        this.listings = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement listings', err);
        this.errorMessage = 'Impossible de charger les annonces.';
        this.isLoading = false;
      }
    });
  }

  loadSearchResults(criteria: CountrySearchCriteria): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.listingService.searchTrips(criteria).subscribe({
      next: (result) => {
        this.currentCriteria = result;
        this.listings = result.content;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur recherche', err);
        this.errorMessage = 'Impossible d’effectuer la recherche.';
        this.listings = [];
        this.isLoading = false;
      }
    });
  }

  get canSearch(): boolean {
    const hasCity = (this.pickupCity?.trim()?.length ?? 0) >= 2;
    const hasDates = !!(this.fromDate && this.toDate);
    return hasCity || hasDates;
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
      fromDate: this.fromDate ? this.toIsoDateLocal(this.fromDate) : undefined,
      toDate: this.toDate ? this.toIsoDateLocal(this.toDate) : undefined,
      page: 0,
      size: this.size,
      activeOnly: true
    };

    if (this.fromDate && this.toDate && this.fromDate > this.toDate) return;
    this.fetch(criteria);

    if (!this.pickupCity && !this.fromDate && !this.toDate && !this.selectedPeriod){
      this.seachResutat = "aucun resultat";
    }

    this.isThereResult = true;
  }

  onSearch2(): void {
    this.selectedPeriod = '';

    const parts: string[] = [];

    if (this.pickupCity?.trim()) {
      parts.push(this.pickupCity.trim());
    }

    if (this.fromDate) {
      parts.push(this.fromDate.toLocaleDateString('de-DE'));
    }

    if (this.toDate) {
      parts.push(`- ${this.toDate.toLocaleDateString('de-DE')}`);
    }

    this.seachResutat = parts.join(' ');
    this.onSearch();
  }

  private fetch(criteria: CountrySearchCriteria): void {
    this.isLoading = true; 

    this.listingService.searchTrips(criteria).subscribe({
      next: (res) => {
        this.listings = res.content;
        this.isLoading = false;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.page = res.number;
        this.size = res.size;
        this.isFirst = res.first;
        this.isLast = res.last;

        this.currentCriteria = { ...criteria, page: this.page, size: this.size };
      },
      error: (err) => {
        console.error('Erreur chargement annonces:', err); 
        this.isLoading = false;
      }
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
  
    this.isThereResult = false;
    this.selectedPeriod = '';
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

  applyQuickPeriod(chip: string) {
    this.selectedPeriod = chip;
    //this.filterSelect();
    this.onSearch();
  }

  clearDate(): void {
    this.toDate = null; 
    this.fromDate = null; 
  }

  /**
   * Methode pour le filtre. elle permet de gerer le focus
   * lorsqu on click sur un items (7jours, 15 jours, 30 jours)
   * @param days 
   */
  selectFilter(days: number) {
    this.selectedFilter = days;
    this.filterSelect2(days);
    console.log('days: ', days);
  }

  filterSelect2(days: number) {
    this.fromDate = new Date();
    this.toDate = new Date();

    if(days === 1){
      this.resetFilters();
    }else if (days === 7) {
      this.seachResutat = "Prochains 7 jours";
      this.toDate.setDate(this.toDate.getDate() + days);
      this.onSearch();
    }else if (days === 15) {
      this.seachResutat = "Prochains 7 jours";
      this.toDate.setDate(this.toDate.getDate() + days);
      this.onSearch();
    }else if (days === 30) {
      this.seachResutat = "Prochains 7 jours";
      this.toDate.setDate(this.toDate.getDate() + days);
      this.onSearch();
    }
  }
}