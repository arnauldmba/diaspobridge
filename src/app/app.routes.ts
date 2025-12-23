import { Routes } from '@angular/router';
import { MyListings } from './my-listings/my-listings';
import { Listings } from './listing/listings';
import { AddListing } from './add-listing/add-listing';
import { UpdateListing } from './update-annonce/update-listing';
import { SearchListing } from './search-listing/search-listing';
import { Login } from './login/login';
import { Forbidden } from './forbidden/forbidden';
import { authGuardGuard, authGuardGuard2 } from './guards/auth-guard-guard';
import { Register } from './register/register';
import { VerifEmail } from './verif-email/verif-email';
import { ListingDetails } from './listing-details/listing-details';
import { ChatMessaging } from './chat-messaging/chat-messaging';
import { MyMatches } from './my-matches/my-matches';

export const routes: Routes = [
    { path: "my-listings", component: MyListings },
    { path: "listings", component: Listings },
    { path: "listing-details/:id", component: ListingDetails },
    { path: "add-listing", component: AddListing },
    { path: "update-listing/:id", component: UpdateListing },
    { path: "chat/:matchId", component: ChatMessaging },
    { path: "messages", component: MyMatches },
    { path: "search-listing", component: SearchListing },
    { path: "login", component: Login },
    { path: "register", component: Register}, 
    { path: "app-forbidden", component: Forbidden },
    { path: "verifEmail", component: VerifEmail },
    { path: "", redirectTo: "listings", pathMatch: "full" }
];
