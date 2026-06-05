import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { ListingService } from './listing.service';
import { environment } from '../../../../environments/environment';
import { TransporterTrip } from '../../../model/transporterTrip.model';
import { CountrySearchCriteria } from '../../../model/country-search-criteria.model';
import { Page } from '../../../model/page.model';


const mockTrip: TransporterTrip = {
  id: 1,
  transporter: {} as any,
  originCity: 'Essen',
  originCountry: 'Germany',
  destCity: 'Douala',
  destCountry: 'Cameroon',
  departDate: '2026-06-25',
  maxWeightKg: 30,
  pricePerKg: 12,
  acceptedTypes: 'DOCUMENT,CLOTHES',
  isActive: true,
  note: 'Départ prévu fin juin',
  createdAt: '2026-06-01T10:00:00Z',
  updatedAt: '2026-06-01T10:00:00Z'
};

const mockTrips: TransporterTrip[] = [
  mockTrip
];

const emptyPage: Page<TransporterTrip> = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  size: 10,
  number: 0,
  first: true,
  last: true,
  numberOfElements: 0
};

const pageWithOneTrip: Page<TransporterTrip> = {
  content: [mockTrip],
  totalElements: 1,
  totalPages: 1,
  size: 10,
  number: 0,
  first: true,
  last: true,
  numberOfElements: 1
};

describe('ListingService', () => {
    let service: ListingService;
    let httpMock: HttpTestingController;

    const apiUrl = environment.apiUrl + '/trip';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ListingService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(ListingService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    /** Test cases for ListingService methods */
    it('should get all listings', () => {

        service.getAllListings().subscribe((listings) => {
            expect(listings).toEqual(mockTrips);
        });

        const req = httpMock.expectOne(apiUrl);

        expect(req.request.method).toBe('GET');

        req.flush(mockTrips);
    });

    /** Test case for getting a listing by ID */
    it('should get listing by id', () => {

        service.getListingById(1).subscribe((listing) => {
            expect(listing).toEqual(mockTrip);
        });

        const req = httpMock.expectOne(`${apiUrl}/1`);

        expect(req.request.method).toBe('GET');

        req.flush(mockTrip);
    });

    /** Test case for adding a listing */
    it('should add a listing', () => {

        const newListing = {
            originCity: 'Essen',
            originCountry: 'Germany',
            destCity: 'Yaoundé',
            destCountry: 'Cameroon',
            departDate: '2026-06-25',
            maxWeightKg: 30,
            pricePerKg: 12,
            acceptedTypes: 'DOCUMENT,CLOTHES',
            isActive: true,
            note: 'Départ prévu fin juin.',
            transporter: {} as any
        } as TransporterTrip;

        service.addListing(newListing).subscribe((listing) => {
            expect(listing).toEqual(newListing);
        });

        const req = httpMock.expectOne(apiUrl);

        expect(req.request.method).toBe('POST');

        expect(req.request.body).toEqual(newListing);

        req.flush(newListing);
    });

    /** Test case for deleting a listing */
    it('should delete a listing', () => {

        const listingId = 1;

        service.deleteListing(listingId).subscribe((response) => {
            expect(response).toBeNull();
        });

        const req = httpMock.expectOne(`${apiUrl}/${listingId}`);

        expect(req.request.method).toBe('DELETE');
        expect(req.request.headers.get('Content-Type')).toBe('application/json');

        req.flush(null);
    });


    it('should update a listing', () => {

        const updatedListing = {
            id: 1,
            originCity: 'Essen',
            originCountry: 'Germany',
            destCity: 'Douala',
            destCountry: 'Cameroon',
            departDate: '2026-06-25',
            maxWeightKg: 30,
            pricePerKg: 12,
            acceptedTypes: 'DOCUMENT,CLOTHES',
            isActive: true,
            note: 'Annonce mise à jour',
            transporter: {} as any
        } as TransporterTrip;

        service.uptateListing(updatedListing).subscribe((listing) => {
            expect(listing).toEqual(updatedListing);
        });

        const req = httpMock.expectOne(`${apiUrl}/1`);

        expect(req.request.method).toBe('PUT');

        expect(req.request.body).toEqual(updatedListing);

        expect(req.request.headers.get('Content-Type'))
            .toBe('application/json');

        req.flush(updatedListing);
    });

    /** Test case for searching trips with criteria */
    it('should search trips with criteria', () => {

        const criteria: CountrySearchCriteria = {
            origin: 'Germany',
            dest: 'Cameroon',
            page: 0,
            size: 10,
            activeOnly: true
        };

        service.searchTrips(criteria).subscribe((response) => {
            expect(response).toEqual(emptyPage);
        });

        const req = httpMock.expectOne((request) =>
            request.url === `${apiUrl}/search`
        );

        expect(req.request.method).toBe('GET');

        expect(req.request.params.get('origin'))
            .toBe('Germany');

        expect(req.request.params.get('dest'))
            .toBe('Cameroon');

        expect(req.request.params.get('page'))
            .toBe('0');

        expect(req.request.params.get('size'))
            .toBe('10');

        expect(req.request.params.get('activeOnly'))
            .toBe('true');

        req.flush(emptyPage);
    });

    /** Test case for searching trips with date filters */
    it('should include date filters when provided', () => {

        const criteria: CountrySearchCriteria = {
            fromDate: '2026-06-01',
            toDate: '2026-06-30'
        };

        service.searchTrips(criteria).subscribe();

        const req = httpMock.expectOne(
            request => request.url === `${apiUrl}/search`
        );

        expect(req.request.params.get('fromDate'))
            .toBe('2026-06-01');

        expect(req.request.params.get('toDate'))
            .toBe('2026-06-30');

        req.flush(emptyPage);
    });

    /** Test case for searching trips with default pagination values */
    it('should use default pagination values', () => {

        const criteria: CountrySearchCriteria = {};

        service.searchTrips(criteria).subscribe();

        const req = httpMock.expectOne(
            request => request.url === `${apiUrl}/search`
        );

        expect(req.request.params.get('page'))
            .toBe('0');

        expect(req.request.params.get('size'))
            .toBe('10');

        expect(req.request.params.get('activeOnly'))
            .toBe('true');

        req.flush({
            content: [],
            totalElements: 0
        });
    });

    it('should search trips by country', () => {
        const criteria: CountrySearchCriteria = {
            origin: 'Germany',
            dest: 'Cameroon',
            page: 0,
            size: 10,
            activeOnly: true
        };

        service.searchTripsByCountry(criteria).subscribe((response) => {
            expect(response).toEqual(emptyPage);
        });

        const req = httpMock.expectOne(
            request => request.url === `${apiUrl}/search/country`
        );

        expect(req.request.method).toBe('GET');

        expect(req.request.params.get('origin')).toBe('Germany');
        expect(req.request.params.get('dest')).toBe('Cameroon');
        expect(req.request.params.get('page')).toBe('0');
        expect(req.request.params.get('size')).toBe('10');
        expect(req.request.params.get('activeOnly')).toBe('true');

        req.flush(emptyPage);
    });

    it('should use default values when searching trips by country', () => {
        const criteria: CountrySearchCriteria = {};

        service.searchTripsByCountry(criteria).subscribe((response) => {
            expect(response).toEqual(emptyPage);
        });

        const req = httpMock.expectOne(
            request => request.url === `${apiUrl}/search/country`
        );

        expect(req.request.method).toBe('GET');
        expect(req.request.params.get('page')).toBe('0');
        expect(req.request.params.get('size')).toBe('10');
        expect(req.request.params.get('activeOnly')).toBe('true');

        expect(req.request.params.has('origin')).toBeFalse();
        expect(req.request.params.has('dest')).toBeFalse();

        req.flush(emptyPage);
    });

    /** Test case for getting user's own trips */
    it('should get my trips', () => {

        service.getMyTrips().subscribe((trips) => {
            expect(trips).toEqual(mockTrips);
        });

        const req = httpMock.expectOne(`${apiUrl}/my`);

        expect(req.request.method).toBe('GET');

        req.flush(mockTrips);
    });

    it('should handle error when listing is not found', () => {
        const listingId = 999;

        service.getListingById(listingId).subscribe({
            next: () => fail('Expected an error, but got a successful response'),
            error: (error) => {
            expect(error.status).toBe(404);
            expect(error.statusText).toBe('Not Found');
            }
        });

        const req = httpMock.expectOne(`${apiUrl}/${listingId}`);

        expect(req.request.method).toBe('GET');

        req.flush(
            { message: 'Listing not found' },
            {
            status: 404,
            statusText: 'Not Found'
            }
        );
    });

    it('should handle server error', () => {
        service.getAllListings().subscribe({
            next: () => fail('Expected server error'),
            error: (error) => {
            expect(error.status).toBe(500);
            }
        });

        const req = httpMock.expectOne(apiUrl);

        req.flush(
            { message: 'Server error' },
            {
            status: 500,
            statusText: 'Internal Server Error'
            }
        );
    });

    it('should return a page containing one trip', () => {

        const criteria: CountrySearchCriteria = {
            origin: 'Germany'
        };

        service.searchTrips(criteria).subscribe((page) => {

            expect(page.content.length).toBe(1);
            expect(page.content[0].originCountry)
            .toBe('Germany');

        });

        const req = httpMock.expectOne(
            request => request.url === `${apiUrl}/search`
        );

        req.flush(pageWithOneTrip);
    });

    it('should handle server error when loading listings fails', () => {
        service.getAllListings().subscribe({
            next: () => fail('Expected a server error, but got a successful response'),
            error: (error) => {
            expect(error.status).toBe(500);
            expect(error.statusText).toBe('Internal Server Error');
            }
        });

        const req = httpMock.expectOne(apiUrl);

        expect(req.request.method).toBe('GET');

        req.flush(
            { message: 'Server error' },
            {
                status: 500,
                statusText: 'Internal Server Error'
            }
        );
    });

});