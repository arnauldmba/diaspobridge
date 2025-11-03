import { Component } from '@angular/core';
import { TransporterTrip } from '../model/transporterTrip.model';
import { TRANSPORTER_TRIPS } from '../mocks/transporterTrip.mock';

@Component({
  selector: 'app-listing',
  imports: [],
  templateUrl: './listings.html',
  styleUrl: './listings.css',
})
export class Listings {

  listings!: TransporterTrip[];

  constructor() { 
    this.listings = TRANSPORTER_TRIPS  
  }
}
