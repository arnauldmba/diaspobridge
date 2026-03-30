import { Routes } from '@angular/router';
import { authGuardGuard2 } from './core/guard/auth-guard-guard';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { adminGuard } from './core/guard/admin.guard';
import { AuthLayout } from './layouts/auth-lauyout/auth-layout';

export const routes: Routes = [
    {
        path: '',
        component: PublicLayout,
        children: [
            {
                path: '', 
                loadComponent: () => 
                    //import('./listing/listings').then(m => m.Listings)
                    import('./features/listings/pages/home-listing-page/home-listing-page').then(m => m.HomeListingPage)
            },
            {
                path: 'listing-details/:id', 
                loadComponent: () => 
                    import('./features/listings/pages/listing-details/listing-details').then(m => m.ListingDetails)
            },
            {
                path: 'my-listings', 
                canActivate: [authGuardGuard2],
                loadComponent: () => 
                    import('./features/profil/pages/my-listings/my-listings').then(m => m.MyListings)
            },
            
            {
                path: 'update-listing/:id', 
                canActivate: [authGuardGuard2],
                loadComponent: () => 
                    import('./features/listings/pages/update-annonce/update-listing').then(m => m.UpdateListing)
            },
            {
                path: 'messages', 
                canActivate: [authGuardGuard2],
                loadComponent: () => 
                    import('./features/match/pages/my-matches/my-matches').then(m => m.MyMatches)
            },
            {
                path: 'chat/:matchId', 
                canActivate: [authGuardGuard2],
                loadComponent: () => 
                    import('./features/match/pages/chat-messaging/chat-messaging').then(m => m.ChatMessaging)
            },
            {
                path: 'add-listing', 
                canActivate: [authGuardGuard2],
                loadComponent: () => 
                    import('./features/listings/pages/add-listing/add-listing').then(m => m.AddListing)
            },
            {
                path: 'profil', 
                canActivate: [authGuardGuard2],
                loadComponent: () => 
                    import('./features/profil/pages/profil/profil').then(m => m.Profil)
            },
            /*{
                path: 'login', 
                loadComponent: () => 
                    import('./features/auth/pages/login/login').then(m => m.Login)
            },
            {
                path: 'register', 
                loadComponent: () => 
                    import('./features/auth/pages/register/register').then(m => m.Register)
            },*/
            {
                path: 'app-forbidden', 
                loadComponent: () => 
                    import('./shared/components/forbidden/forbidden').then(m => m.Forbidden)
            },
            /*{
                path: 'reset-password', 
                loadComponent: () => 
                    import('./features/auth/pages/reset-password-compotent/reset-password-compotent').then(m => m.ResetPasswordCompotent)
            },
            {
                path: 'forgot-password', 
                loadComponent: () => 
                    import('./features/auth/pages/forgot-password-component/forgot-password-component').then(m => m.ForgotPasswordComponent)
            },
            {
                path: 'verifEmail', 
                loadComponent: () => 
                    import('./features/auth/verif-email/verif-email').then(m => m.VerifEmail)
            },*/
            {
                path: 'apropos', 
                loadComponent: () => 
                    import('./features/profil/pages/footer/apropos/apropos').then(m => m.Apropos)
            },
            {
                path: 'politique-de-confidentialite', 
                loadComponent: () => 
                    import('./features/profil/pages/footer/privacy-policy/privacy-policy').then(m => m.PrivacyPolicy)
            },
            {
                path: 'mention-legale', 
                loadComponent: () => 
                    import('./features/profil/pages/footer/legal-notice/legal-notice').then(m => m.LegalNotice)
            },
            {
                path: 'faq', 
                loadComponent: () => 
                    import('./features/profil/pages/footer/faq/faq').then(m => m.Faq)
            },
            {
                path: 'contact', 
                loadComponent: () => 
                    import('./features/profil/pages/footer/contact/contact').then(m => m.Contact)
            }
        ]
    },

    {
        path: 'auth',
        component: AuthLayout,
        children: [
            {
                path: 'login',
                loadComponent: () =>
                    import('./features/auth/pages/login/login')
                        .then(m => m.Login)
            },
            {
                path: 'register',
                loadComponent: () =>
                    import('./features/auth/pages/register/register')
                        .then(m => m.Register)
            },
            {
                path: 'forgot-password',
                loadComponent: () =>
                    import('./features/auth/pages/forgot-password-component/forgot-password-component')
                        .then(m => m.ForgotPasswordComponent)
            },
            {
                path: 'reset-password',
                loadComponent: () =>
                    import('./features/auth/pages/reset-password-compotent/reset-password-compotent')
                        .then(m => m.ResetPasswordCompotent)
            },
            {
                path: 'verify-email',
                loadComponent: () =>
                    import('./features/auth/pages/verif-email/verif-email')
                        .then(m => m.VerifEmail)
            }
        ]
    },

    {
        path: 'admin',
        component: AdminLayout,
        canActivate: [authGuardGuard2, adminGuard],
        children: [
            {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/admin/page/dashboard/admin-dashbord.component/admin-dashbord.component').then(m => m.AdminDashbordComponent)
            },
            {
                path: 'users',
                loadComponent: () =>
                import('./features/admin/page/users/admin-users.component/admin-users.component').then(m => m.AdminUsersComponent)
            },

            {
                path: 'listings',
                loadComponent: () =>
                import('./features/admin/page/listings/admin-trips.component/admin-listings.component').then(m => m.AdminListingsComponent)
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];