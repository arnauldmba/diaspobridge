import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { of, throwError } from 'rxjs';
import { provideRouter, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { AddListing } from './add-listing';
import { ListingService } from '../../services/listing.service';
import { CityDataService } from '../../../../shared/services/city-data.services';

@Pipe({
  name: 'translate',
  standalone: true
})
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('AddListing', () => {
  let component: AddListing;
  let fixture: ComponentFixture<AddListing>;
  let router: Router;

  const listingServiceMock = {
    addListing: jasmine.createSpy('addListing')
  };

  const cityDataServiceMock = {
    getAllCities: jasmine.createSpy('getAllCities').and.returnValue([
      { name: 'Essen', country: 'Allemagne' },
      { name: 'Douala', country: 'Cameroun' }
    ])
  };

  const validFormMock = {
    invalid: false,
    control: {
      markAllAsTouched: jasmine.createSpy('markAllAsTouched')
    }
  } as unknown as NgForm;

  const invalidFormMock = {
    invalid: true,
    control: {
      markAllAsTouched: jasmine.createSpy('markAllAsTouched')
    }
  } as unknown as NgForm;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddListing],
      providers: [
        provideRouter([]),
        {
          provide: ListingService,
          useValue: listingServiceMock
        },
        {
          provide: CityDataService,
          useValue: cityDataServiceMock
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(AddListing, {
        remove: {
          imports: [TranslatePipe]
        },
        add: {
          imports: [MockTranslatePipe]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(AddListing);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  afterEach(() => {
    listingServiceMock.addListing.calls.reset();
    cityDataServiceMock.getAllCities.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cities on init', () => {
    expect(cityDataServiceMock.getAllCities).toHaveBeenCalled();
    expect(component.cities.length).toBe(2);
  });

  it('should not submit when form is invalid', () => {
    component.addListing(invalidFormMock);

    expect(component.message).toBe('Veuillez corriger les champs en rouge.');
    expect(invalidFormMock.control.markAllAsTouched).toHaveBeenCalled();
    expect(listingServiceMock.addListing).not.toHaveBeenCalled();
  });

  it('should call ListingService.addListing when form is valid', () => {
    listingServiceMock.addListing.and.returnValue(of(component.newListing));

    component.addListing(validFormMock);

    expect(listingServiceMock.addListing).toHaveBeenCalledWith(component.newListing);
  });

  it('should navigate to listings after successful creation', () => {
    listingServiceMock.addListing.and.returnValue(of(component.newListing));

    component.addListing(validFormMock);

    expect(component.message).toBe('Listing added successfully!');
    expect(router.navigate).toHaveBeenCalledWith(['/listings']);
  });

  it('should show error message when creation fails', () => {
    listingServiceMock.addListing.and.returnValue(
      throwError(() => new Error('Server error'))
    );

    component.addListing(validFormMock);

    expect(component.message).toBe('Error adding listing. Please try again.');
  });

  it('should reset form', () => {
    component.newListing.originCity = 'Berlin';
    component.newListing.destCity = 'Yaoundé';
    component.newListing.maxWeightKg = 25;

    component.resetForm();

    expect(component.newListing.originCity).toBe('');
    expect(component.newListing.originCountry).toBe('Allemagne');
    expect(component.newListing.destCity).toBe('');
    expect(component.newListing.destCountry).toBe('Cameroun');
    expect(component.newListing.maxWeightKg).toBe(0);
    expect(component.newListing.pricePerKg).toBe(0);
    expect(component.newListing.isActive).toBeTrue();
  });
});