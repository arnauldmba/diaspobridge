import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../services/listing.service';
import { MatchService } from '../services/match.service';

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
  //private chatService = inject(ChatMessaging);
  trip: any;
  loading = true;

  constructor(private router: Router, private matchService: MatchService) {}  

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

  onContact() {

    this.matchService.contactTransporter(this.trip.id).subscribe({
      next: (match) => {
        console.log('Match created:', match);
        // Navigate to chat with the match ID
        this.router.navigate(['/chat', match.id]);
      },
      error: (err) => {
        console.error('Error contacting transporter', err);
        
      }
    });
  }

  onContact2() {
    // Placeholder for contact logic
    console.log('Contact transporter for trip ID:', this.trip.id);
    this.router.navigate(['/chat', this.trip.id]);
  }

}