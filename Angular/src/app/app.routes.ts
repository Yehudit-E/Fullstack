import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';
// import { DisplayUsersComponent } from './components/display-users/display-users.component';
import { entryAuthGuard } from './guard/entry-auth.guard';
import { SongsComponent } from './components/songs/songs.component';
import { UploadRequestsComponent } from './components/upload-requests/upload-requests.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { UploadPublicSongComponent } from './components/upload-public-song/upload-public-song.component';

export const routes: Routes = [
    {path: '',component: LoginComponent},
    {path: 'home',component: HomeComponent},
    {path: 'users',component: UsersComponent,canActivate:[entryAuthGuard]},
    {path: 'upload-requests',component: UploadRequestsComponent,canActivate:[entryAuthGuard]},
    {path: 'analytics',component: AnalyticsComponent,canActivate:[entryAuthGuard]},
    {path: 'songs',component: SongsComponent,canActivate:[entryAuthGuard]},
    {path: 'upload',component: UploadPublicSongComponent,canActivate:[entryAuthGuard]},

];
