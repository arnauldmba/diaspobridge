import { Component, NgModule, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TransporterTrip } from '../model/transporterTrip.model';
import { ListingService } from '../services/listing.service';
import { User } from '../model/users.model';
import { Router } from '@angular/router';
import { MatFormField, MatLabel, MatHint, MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerControl, MatDatepickerModule, MatDatepickerPanel } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { CityAutocompleteComponent } from "../city-autocomplete-component/city-autocomplete-component";
import { CITIES_CM } from '../model/cities-cm';
import { CITIES_DE } from '../model/cities-de';


@Component({
  selector: 'app-add-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormField, MatLabel, MatIcon, MatHint, MatCardModule,
    MatButtonModule, MatInputModule, MatFormFieldModule, MatStepperModule, MatDatepickerModule, MatChipsModule, CityAutocompleteComponent],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-listing.html',
  styleUrl: './add-listing.css',
})
export class AddListing implements OnInit {

  citiesDE = CITIES_DE;
  citiesCM = CITIES_CM;

  message: string = '';
  originCountry: any;
  picker!: MatDatepickerPanel<MatDatepickerControl<any>, any, any>;

  today = new Date();

  futureDatesOnly = (d: Date | null): boolean => {
    if (!d) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date >= today;
  };

  newListing: TransporterTrip = {
    originCity: '',
    originCountry: 'Allemagne',
    destCity: '',
    destCountry: 'Cameroun',
    departDate: '',
    maxWeightKg: 0,
    pricePerKg: 0,
    isActive: true,
    transporter: {} as User
  };

  constructor(
    private listingService: ListingService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  addListing(form: NgForm) {
    if (form.invalid) {
      this.message = 'Veuillez corriger les champs en rouge.';
      form.control.markAllAsTouched(); // force l’affichage des erreurs
      return; // ✅ STOP : n’envoie rien
    }

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
