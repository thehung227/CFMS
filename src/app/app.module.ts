// src/app/app.module.ts
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';

import { AuthenService } from './core/services/authen.service';
import { AuthGuard } from './core/guards/auth.guard';
import { AppConfigService } from './core/services/app-config.service';
import { HttpModule } from '@angular/http';

export function initApp(cfg: AppConfigService) { return () => cfg.load(); }

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  providers: [
    // Các service/guard dùng toàn app
    AuthenService,          // 👈 THÊM DÒNG NÀY
    AuthGuard,
    AppConfigService,
    { provide: APP_INITIALIZER, useFactory: initApp, deps: [AppConfigService], multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
