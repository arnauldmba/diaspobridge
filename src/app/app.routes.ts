import { Routes } from '@angular/router';
import { MyListings } from './my-listings/my-listings';
import { Listings } from './listing/listings';
import { AddListing } from './add-listing/add-listing';
import { UpdateListing } from './update-annonce/update-listing';
import { SearchListing } from './search-listing/search-listing';

export const routes: Routes = [
    { path: "my-listings", component: MyListings },
    { path: "listings", component: Listings },
    { path: "add-listing", component: AddListing },
    { path: "update-listing/:id", component: UpdateListing },
    { path: "search-listing", component: SearchListing },
    { path: "", redirectTo: "listings", pathMatch: "full" }
];
