import { Component, OnInit } from '@angular/core';
import { TransporterTrip } from '../model/transporterTrip.model';
import { ListingService } from '../services/listing.service';

@Component({
  selector: 'app-listing',
  imports: [],
  templateUrl: './listings.html',
  styleUrl: './listings.css',
})
export class Listings implements OnInit  {

  listings!: TransporterTrip[];

  constructor(private listingService: ListingService) { 
    //this.listings = listingService.getAllListings();
  }
  
  ngOnInit(): void {
    this.listingService.getAllListings().subscribe(data => {
      console.log(data);
      this.listings = data;
    });
  }
}
