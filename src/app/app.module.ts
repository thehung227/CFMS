import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { AuthGuard } from './core/guards/auth.guard';

import { AppComponent } from './app.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import { routes } from './login/login.module';
import { AuthenService } from './core/services/authen.service';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthenService, AuthGuard, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
