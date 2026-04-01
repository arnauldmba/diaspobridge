import { Component, OnInit } from '@angular/core';
import { ListingList } from "../../components/listing-list/listing-list";
import { TransporterTrip } from '../../../../model/transporterTrip.model';
import { CountrySearchCriteria } from '../../../../model/country-search-criteria.model';
import { ListingService } from '../../services/listing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingFilters } from "../../components/listing-filters/listing-filters";
import { SeachBar } from "../../components/seach-bar/seach-bar";
import { SeachBarComputer } from "../../components/seach-bar-computer/seach-bar-computer";
import { TranslatePipe } from '@ngx-translate/core';
import { Footer } from "../../../profil/pages/footer/footer/footer";

@Component({
  selector: 'app-home-listing-page',
  standalone: true,
  imports: [ListingList, ListingFilters, SeachBar, SeachBarComputer, TranslatePipe, Footer],
  templateUrl: './home-listing-page.html',
  styleUrl: './home-listing-page.css',
})
export class HomeListingPage implements OnInit {

  selectedFilter = 1;

  isLoading = false;
  isThereResult = false;
  searchResult = '';

  listings: TransporterTrip[] = [];

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

  searchCity = "";

  constructor(
    private listingService: ListingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchCity = params['dest'] || undefined;
      const dest = params['dest'] || undefined;
      const fromDate = params['fromDate'] || undefined;
      const toDate = params['toDate'] || undefined;
      const page = params['page'] ? Number(params['page']) : 0;
      const size = params['size'] ? Number(params['size']) : this.size;

      const hasSearch = !!dest || !!fromDate || !!toDate;

      const criteria: CountrySearchCriteria = {
        dest,
        fromDate,
        toDate,
        page,
        size,
        activeOnly: true
      };

      this.searchResult = hasSearch
        ? this.buildSearchLabelFromParams(dest, fromDate, toDate)
        : '';

      this.isThereResult = hasSearch;
      this.fetch(criteria);
    });
  }

  onSearch(filters: {
    pickupCity: string | null;
    dest: string | null;
    fromDate: Date | null;
    toDate: Date | null;
  }): void {
    this.router.navigate(['/listings'], {
      queryParams: {
        pickupCity: filters.pickupCity?.trim() || null,
        dest: filters.dest?.trim() || null,
        fromDate: filters.fromDate ? this.toIsoDateLocal(filters.fromDate) : null,
        toDate: filters.toDate ? this.toIsoDateLocal(filters.toDate) : null,
        page: 0,
        size: this.size
      }
    });
  }

  get resultLabel(): string {
    if (this.totalElements === 0) return 'Aucun trajet trouvé';
    if (this.totalElements === 1) return '1 trajet trouvé';
    return `${this.totalElements} trajets trouvés`;
  }

  onResetFilters(): void {
    this.router.navigate(['/listings'], {
      queryParams: {
        pickupCity: null,
        dest: null,
        fromDate: null,
        toDate: null,
        page: 0,
        size: this.size
      }
    });
  }

  openListing(id: number | undefined): void {
    if (!id) return;
    this.router.navigate(['/listing-details', id]);
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
    pickupCity?: string,
    dest?: string,
    fromDate?: string,
    toDate?: string
  ): string {
    const parts: string[] = [];

    if (pickupCity) {
      parts.push(`Départ: ${pickupCity}`);
    }

    if (dest) {
      parts.push(`Arrivée: ${dest}`);
    }

    if (fromDate) {
      parts.push(`Du ${this.formatDateLabel(fromDate)}`);
    }

    if (toDate) {
      parts.push(`au ${this.formatDateLabel(toDate)}`);
    }

    return parts.join(' • ');
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

  onFilterSelected(days: number): void {
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
        //dest: this.pickupCity?.trim() || null,
        fromDate: this.toIsoDateLocal(fromDate),
        toDate: this.toIsoDateLocal(toDate),
        page: 0,
        size: this.size
      }
    });
  }

  onDesktopSearch(filters: {
    destCity: string | null;
    fromDate: Date | null;
    toDate: Date | null;
  }): void {
    this.router.navigate(['/listings'], {
      queryParams: {
        dest: filters.destCity,
        fromDate: filters.fromDate ? this.toIsoDateLocal(filters.fromDate) : null,
        toDate: filters.toDate ? this.toIsoDateLocal(filters.toDate) : null,
        page: 0,
        size: 12
      }
    });
  }
}
