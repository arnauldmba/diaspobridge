import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransporterTrip } from '../model/transporterTrip.model';


@Component({
  selector: 'app-add-listing',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-listing.html',
  styleUrl: './add-listing.css',
})
export class AddListing implements OnInit {

  newListing = new TransporterTrip();

  constructor() { }

  ngOnInit():void {
    // Initialization logic here
  } 

  addLisching() {
    this.newListing.id = this.newListing.id ?? Math.floor(Math.random() * 10000);
    this.newListing.createdAt = new Date().toISOString();
    this.newListing.updatedAt = new Date().toISOString();
    console.log(this.newListing);
    // Logic to add a new listing
  } 

}
