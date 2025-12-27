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

@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCardModule, 
    MatButtonModule, MatInputModule, MatFormFieldModule, MatStepperModule,
  ],
  templateUrl: './listings.html',
  styleUrl: './listings.css',
})
export class Listings implements OnInit {

  listings!: TransporterTrip[];

  originCountry: string = '';
  destCountry: string = '';

  page = 0;
  size = 30;

  constructor(private listingService: ListingService, private router: Router) { }

  ngOnInit(): void {

    this.listingService.getAllListings().subscribe(data => {
      console.log(data);
      this.listings = data;
    });
  }

  openListing(id: number | undefined) {
    this.router.navigate(['/listing-details/', id]);
    console.log('Open listing with ID:', id);
  }

  loadAllTrips(): void {
    const criteria: CountrySearchCriteria = {
      page: this.page,
      size: this.size,
      activeOnly: true
    };

    this.listingService.searchTripsByCountry(criteria).subscribe({
      next: (page) => {
        this.listings = page.content;
      },
      error: (err) => {
        console.error('Erreur chargement annonces', err);
      }
    });
  }

  onSearch(): void {
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
        console.log('Résultats recherche', page);
      },
      error: (err) => {
        console.error('Erreur recherche annonces', err);
      }
    });
  }

  resetFilters(): void {
    this.originCountry = '';
    this.destCountry = '';
    this.page = 0;
    this.loadAllTrips();
  }
}

