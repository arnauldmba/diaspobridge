import { Routes } from '@angular/router';
import { MyListings } from './my-listings/my-listings';
import { Listings } from './listing/listings';
import { AddListing } from './add-listing/add-listing';
import { UpdateListing } from './update-annonce/update-listing';
import { SearchListing } from './search-listing/search-listing';
import { Login } from './login/login';
import { Forbidden } from './forbidden/forbidden';
import { authGuardGuard2 } from './guards/auth-guard-guard';
import { Register } from './register/register';
import { VerifEmail } from './verif-email/verif-email';
import { ListingDetails } from './listing-details/listing-details';
import { ChatMessaging } from './chat-messaging/chat-messaging';
import { MyMatches } from './my-matches/my-matches';
import { ForgotPasswordComponent } from './authentication/forgot-password-component/forgot-password-component';
import { ResetPasswordCompotent } from './authentication/reset-password-compotent/reset-password-compotent';
import { CityAutocompleteComponent } from './city-autocomplete-component/city-autocomplete-component';
import { Apropos } from './footer/apropos/apropos';
import { Faq } from './footer/faq/faq';
import { Contact } from './footer/contact/contact';
import { LegalNotice } from './footer/legal-notice/legal-notice';
import { PrivacyPolicy } from './footer/privacy-policy/privacy-policy';
import { Profil } from './profil/profil';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';

export const routes1: Routes = [
    { path: "my-listings", component: MyListings, canActivate: [authGuardGuard2]},
    { path: "apropos", component: Apropos },
    { path: "politique-de-confidentialite", component: PrivacyPolicy },
    { path: "mention-legale", component: LegalNotice },
    { path: "faq", component: Faq },
    { path: "contact", component: Contact },
    { path: "listings", component: Listings },
    { path: "profil", component: Profil, canActivate: [authGuardGuard2] },
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

export const routes: Routes = [
    {
        path: '',
        component: PublicLayout,
        children: [
            {
                path: '', 
                loadComponent: () => 
                    import('./listing/listings').then(m => m.Listings)
            },
            {
                path: 'search-listing', 
                loadComponent: () => 
                    import('./search-listing/search-listing').then(m => m.SearchListing)
            },
            {
                path: 'my-listings', 
                canActivate: [authGuardGuard2],
                loadComponent: () => 
                    import('./my-listings/my-listings').then(m => m.MyListings)
            },
            {
                path: 'listing-details/:id', 
                loadComponent: () => 
                    import('./listing-details/listing-details').then(m => m.ListingDetails)
            },
            {
                path: 'update-listing/:id', 
                loadComponent: () => 
                    import('./update-annonce/update-listing').then(m => m.UpdateListing)
            },
            {
                path: 'messages', 
                canActivate: [authGuardGuard2],
                loadComponent: () => 
                    import('./my-matches/my-matches').then(m => m.MyMatches)
            },
            {
                path: 'messages/:matchId', 
                canActivate: [authGuardGuard2],
                loadComponent: () => 
                    import('./my-matches/my-matches').then(m => m.MyMatches)
            },
            {
                path: 'add-listing', 
                canActivate: [authGuardGuard2],
                loadComponent: () => 
                    import('./add-listing/add-listing').then(m => m.AddListing)
            },
            {
                path: 'profil', 
                canActivate: [authGuardGuard2],
                loadComponent: () => 
                    import('./profil/profil').then(m => m.Profil)
            },
            {
                path: 'login', 
                loadComponent: () => 
                    import('./login/login').then(m => m.Login)
            },
            {
                path: 'register', 
                loadComponent: () => 
                    import('./register/register').then(m => m.Register)
            },
            {
                path: 'app-forbidden', 
                loadComponent: () => 
                    import('./forbidden/forbidden').then(m => m.Forbidden)
            },
            {
                path: 'reset-password', 
                loadComponent: () => 
                    import('./authentication/reset-password-compotent/reset-password-compotent').then(m => m.ResetPasswordCompotent)
            },
            {
                path: 'forgot-password', 
                loadComponent: () => 
                    import('./authentication/forgot-password-component/forgot-password-component').then(m => m.ForgotPasswordComponent)
            },
            {
                path: 'verifEmail', 
                loadComponent: () => 
                    import('./verif-email/verif-email').then(m => m.VerifEmail)
            },
            {
                path: 'apropos', 
                loadComponent: () => 
                    import('./footer/apropos/apropos').then(m => m.Apropos)
            },
            {
                path: 'politique-de-confidentialite', 
                loadComponent: () => 
                    import('./footer/privacy-policy/privacy-policy').then(m => m.PrivacyPolicy)
            },
            {
                path: 'mention-legale', 
                loadComponent: () => 
                    import('./footer/legal-notice/legal-notice').then(m => m.LegalNotice)
            },
            {
                path: 'faq', 
                loadComponent: () => 
                    import('./footer/faq/faq').then(m => m.Faq)
            },
            {
                path: 'contact', 
                loadComponent: () => 
                    import('./footer/contact/contact').then(m => m.Contact)
            }
        ]
    },
    {
        path: 'admin',
        component: AdminLayout,
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/admin/dashboard/admin-dashbord.component/admin-dashbord.component').then(m => m.AdminDashbordComponent)
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];