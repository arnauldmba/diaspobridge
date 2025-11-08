import { Routes } from '@angular/router';
import { MyListings } from './my-listings/my-listings';
import { Listings } from './listing/listings';
import { AddListing } from './add-listing/add-listing';

export const routes: Routes = [
    { path: "my-listings", component: MyListings },
    { path: "listings", component: Listings },
    { path: "add-listing", component: AddListing },
];
