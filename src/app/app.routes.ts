import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const appRoutes: Routes = [
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    { path: 'main', loadChildren: './main/main.module#MainModule', canActivate: [AuthGuard] },
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
    { path: 'logout', loadChildren: './logout/logout.module#LogoutModule' }
]