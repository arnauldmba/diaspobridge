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
import { MenuBurger } from './shared/menu-burger/menu-burger';
import { ForgotPasswordComponent } from './authentication/forgot-password-component/forgot-password-component';
import { ResetPasswordCompotent } from './authentication/reset-password-compotent/reset-password-compotent';
import { CityAutocompleteComponent } from './city-autocomplete-component/city-autocomplete-component';
import { Apropos } from './footer/apropos/apropos';
import { Faq } from './footer/faq/faq';
import { Contact } from './footer/contact/contact';
import { LegalNotice } from './footer/legal-notice/legal-notice';
import { PrivacyPolicy } from './footer/privacy-policy/privacy-policy';

export const routes: Routes = [
    { path: "my-listings", component: MyListings, canActivate: [authGuardGuard2]},
    { path: "apropos", component: Apropos },
    { path: "politique-de-confidentialite", component: PrivacyPolicy },
    { path: "mention-legale", component: LegalNotice },
    { path: "faq", component: Faq },
    { path: "contact", component: Contact },
    { path: "listings", component: Listings },
    { path: "menu", component: MenuBurger },
    { path: "listing-details/:id", component: ListingDetails },
    { path: "add-listing", component: AddListing, canActivate: [authGuardGuard2] },
    { path: "update-listing/:id", component: UpdateListing },
    { path: "seach", component: CityAutocompleteComponent },
    { path: "chat/:matchId", component: ChatMessaging },
    { path: "messages", component: MyMatches, canActivate: [authGuardGuard2] },
    { path: "messages/:matchId", component: MyMatches, canActivate: [authGuardGuard2] },
    { path: "search-listing", component: SearchListing },
    { path: "forgot-password", component: ForgotPasswordComponent },
    { path: "reset-password", component: ResetPasswordCompotent },
    { path: "login", component: Login },
    { path: "register", component: Register}, 
    { path: "app-forbidden", component: Forbidden },
    { path: "verifEmail", component: VerifEmail },
    { path: "", redirectTo: "listings", pathMatch: "full" }
];