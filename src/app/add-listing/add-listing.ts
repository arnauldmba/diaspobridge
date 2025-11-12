import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransporterTrip } from '../model/transporterTrip.model';
import { ListingService } from '../services/listing.service';
import { Role, User } from '../model/users.model';


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

  constructor(private listingService: ListingService) {}

  ngOnInit():void {
    // Initialization logic here
  } 

  addLisching() {

    const transporter1: User = {
      id: 1,
      email: 'jean.transporter@mail.com',
      firstName: 'Jean',
      lastName: 'Mbappe',
      phone: '+49 176 1234567',
      role: Role.TRANSPORTER,
      isActive: true,
      emailVerified: true
    };
    
    this.newListing.id = this.newListing.id ?? Math.floor(Math.random() * 10000);
    this.newListing.transporter = transporter1;
    this.newListing.createdAt = new Date().toISOString();
    this.newListing.updatedAt = new Date().toISOString();
    this.listingService.addListing(this.newListing);
    console.log(this.newListing);
    // Logic to add a new listing

    this.message = 'Listing added successfully!';
  } 

}
