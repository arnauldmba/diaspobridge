import { Routes } from '@angular/router';
import { MyListings } from './my-listings/my-listings';
import { Listings } from './listing/listings';

export const routes: Routes = [
    { path: "my-listings", component: MyListings },
    { path: "listings", component: Listings },
];
