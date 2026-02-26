import { Component, NgModule, OnInit } from '@angular/core';
import { TransporterTrip } from '../model/transporterTrip.model';
import { ListingService } from '../services/listing.service';
import { CountrySearchCriteria } from '../model/country-search-criteria.model';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-search-listing',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-listing.html',
  styleUrl: './search-listing.css',
})
export class SearchListing implements OnInit {

  listings: TransporterTrip[] = [];
  originCountry = '';
  destCountry = '';
  page = 0;
  size = 10;

  constructor(private listingService: ListingService) {}

  ngOnInit(): void {
  }

  search(): void {
    const criteria: CountrySearchCriteria = {
      origin: this.originCountry || undefined,
      dest: this.destCountry || undefined,
      page: this.page,
      size: this.size,
      activeOnly: true
    };

    this.listingService.searchTripsByCountry(criteria).subscribe({
      next: (page) => {
        this.listings = page.content;
        /*console.log('Résultats de la recherche:', page);*/
      },
      error: (err) => {
        console.error('seach error', err);
      }
    });
  }

}
