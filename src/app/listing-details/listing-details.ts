import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListingService } from '../services/listing.service';

@Component({
  selector: 'app-listing-details',
  standalone: true,
  imports: [],
  templateUrl: './listing-details.html',
  styleUrl: './listing-details.css',
})
export class ListingDetails {

  private route = inject(ActivatedRoute);
  private listingService = inject(ListingService);
  trip: any;
  loading = true;

  ngOnInit(): void {
    const listingId = Number(this.route.snapshot.paramMap.get('id'));
    
    console.log('Listing ID from route:', listingId);

    this.listingService.getListingById(listingId).subscribe({
      next: (data) => {
        this.trip = data;
        this.loading = false;
        console.log('Listing details:', this.trip);
      },
      error: (err) => {
        console.error('Error fetching listing details', err);
        this.loading = false;
      }
    });
    // You can now use listingId to fetch the listing details using tripService
  }

}
