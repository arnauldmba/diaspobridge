import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransporterTrip } from '../model/transporterTrip.model';
import { ListingService } from '../services/listing.service';
import { User } from '../model/users.model';
import { Router } from '@angular/router';
import { Role } from '../model/role.models';


@Component({
  selector: 'app-add-listing',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-listing.html',
  styleUrl: './add-listing.css',
})
export class AddListing implements OnInit {

  newListing = new TransporterTrip();
  message: string = '';

  constructor(private listingService: ListingService, private router: Router) {}

  ngOnInit():void {
  } 

  addListing() {
  this.listingService.addListing(this.newListing).subscribe({
    next: (response) => {
      console.log('Listing added successfully:', response);
      this.message = 'Listing added successfully!';
      this.router.navigate(['/listings']);
    },
    error: (error) => {
      console.error('Error adding listing:', error);
      this.message = 'Error adding listing. Please try again.';
    }
  });
}

}
