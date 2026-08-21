import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormField, MatLabel, MatHint, MatFormFieldModule } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerControl, MatDatepickerModule, MatDatepickerPanel } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { User } from '../../../../model/users.model';
import { TransporterTrip } from '../../../../model/transporterTrip.model';
import { ListingService } from '../../services/listing.service';
import { CityAutocompleteComponent } from '../../../../shared/components/city-autocomplete-component/city-autocomplete-component';
import { BaseCity } from '../../../../shared/models/cities-model';
import { CityDataService } from '../../../../shared/services/city-data.services';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';
import { EmailVerification } from "../../../auth/components/email-verification/email-verification";
import { CreateTripRequest } from '../../models/create-trip-request';


@Component({
  selector: 'app-add-listing',
  standalone: true,
  imports: [CommonModule, MatFormField, MatLabel, MatIcon, MatHint, MatCardModule, TranslatePipe,
    MatButtonModule, MatInputModule, MatFormFieldModule, MatStepperModule, MatDatepickerModule, MatChipsModule, CityAutocompleteComponent, ReactiveFormsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-listing.html',
  styleUrl: './add-listing.css',
})
export class AddListing implements OnInit {

  private readonly formBuilder = inject(FormBuilder);

  cities: BaseCity[] = [];

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

  constructor(
    private listingService: ListingService,
    private authService: AuthService,
    private router: Router,
    private cityDataService: CityDataService
  ) { }

  readonly tripFormModel = this.formBuilder.group({
    originCity: this.formBuilder.nonNullable.control('', {
      validators: [
        Validators.required,
        Validators.minLength(2)
      ]
    }),

    destCity: this.formBuilder.nonNullable.control('', {
      validators: [
        Validators.required,
        Validators.minLength(2)
      ]
    }),

    departDate: this.formBuilder.control<Date | null>(null, {
      validators: [
        Validators.required
      ]
    }),

    maxWeightKg: this.formBuilder.control<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(1)
      ]
    }),

    pricePerKg: this.formBuilder.control<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(0)
      ]
    }),

    note: this.formBuilder.nonNullable.control('', {
      validators: [
        Validators.maxLength(500)
      ]
    })
  });

  ngOnInit(): void {
    this.cities = this.cityDataService.getAllCities();
  }

  isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  /*
  onSubmit(form: NgForm): void{
    if (form.invalid) {
      this.message = 'Veuillez corriger les champs en rouge.';
      form.control.markAllAsTouched(); // force l’affichage des erreurs
      return; // 
    }

    if(this.authService.isLoggedIn()) {
      this.addListing();
    } else {
      console.log('EMAIL_VERIFIACTION');
    }
  }*/

    onSubmit(): void {
      if (this.tripFormModel.invalid) {
        this.message = 'Veuillez corriger les champs en rouge.';
        this.tripFormModel.markAllAsTouched();
        return;
      }

      const formValue = this.tripFormModel.getRawValue();

      if (
        !formValue.departDate ||
        formValue.maxWeightKg === null ||
        formValue.pricePerKg === null
      ) {
        this.tripFormModel.markAllAsTouched();
        return;
      }

      const originCity = this.findCityByName(formValue.originCity);
      const destCity = this.findCityByName(formValue.destCity);

      const request: CreateTripRequest = {
        originCity: formValue.originCity.trim(),
        originCountry: originCity?.country,

        destCity: formValue.destCity.trim(),
        destCountry: destCity?.country,

        departDate: this.formatLocalDate(formValue.departDate),

        maxWeightKg: formValue.maxWeightKg,
        pricePerKg: formValue.pricePerKg,

        note: formValue.note.trim(),
      };

      if (this.authService.isLoggedIn()) {
        this.addListing(request);
      } else {
        console.log('Trajet conservé avant authentification :', request);
      }
    }

  addListing(request: CreateTripRequest): void {
    this.listingService.addListing(request).subscribe({
      next: () => {
        this.message = 'Listing added successfully!';
        this.router.navigate(['/listings']);
      },
      error: () => {
        this.message = 'Error adding listing. Please try again.';
      }
    });
  }

  /*resetForm(){
    this.newListing = {
      originCity: '',
      originCountry: 'Allemagne',
      destCity: '',
      destCountry: 'Cameroun',
      departDate: '',
      maxWeightKg: null,
      pricePerKg: 0,
      note: '',
      isActive: true,
      transporter: {} as User
    };
  }*/

 createEmptyListing(): TransporterTrip{
    return {
      originCity: '',
      originCountry: 'Allemagne',
      destCity: '',
      destCountry: 'Cameroun',
      departDate: '',
      maxWeightKg: null,
      pricePerKg: 0,
      note: '',
      isActive: true,
      transporter: {} as User
    };
  }

  resetForm(){
  }

  private findCityByName(name: string): BaseCity | undefined {
    const normalizedName = name.trim().toLowerCase();

    return this.cities.find(city =>
      city.name.trim().toLowerCase() === normalizedName ||
      city.aliases?.some(
        alias => alias.trim().toLowerCase() === normalizedName
      )
    );
  }

  private formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}