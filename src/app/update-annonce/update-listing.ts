import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../services/listing.service';
import { TransporterTrip } from '../model/transporterTrip.model';
import { FormControl, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-listing',
  imports: [FormsModule],
  templateUrl: './update-listing.html',
  styles: ``,
})
export class UpdateListing implements OnInit {

  currentListing = new TransporterTrip();

  constructor(private activatedRoute: ActivatedRoute, 
              private listingService: ListingService,
              private router: Router) {}

  ngOnInit(): void {

    this.listingService.consultListing(this.activatedRoute.snapshot.params['id']).subscribe(listing => {
      this.currentListing = listing;
    });
    console.log("---", this.currentListing);
  }

  updateListing(updatedListing: TransporterTrip): void {
    this.listingService.uptateListing(updatedListing).subscribe(() => {
      console.log('Listing updated successfully');
    });
    this.router.navigate(['/listings']);
  }

}
