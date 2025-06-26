import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { Routes, RouterModule } from '@angular/router';
import { HomeContentComponent } from './home-content/home-content.component';

const homeRoutes: Routes = [
  // localhost:8888/main/home
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  // localhost:8888/main/home/index
  { path: 'index', component: HomeComponent }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes)
  ],
  declarations: [
    HomeComponent,
    HomeContentComponent
  ]
})
export class HomeModule { }
