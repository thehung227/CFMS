import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { mainRoutes } from './main.routes';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';

import { HomeHeaderComponent } from './home/home-header/home-header.component';
import { HomeSidebarComponent } from './home/home-sidebar/home-sidebar.component';
import { HomeControlSideBarComponent } from './home/home-control-sidebar/home-control-sidebar.component';
import { HomeFooterComponent } from './home/home-footer/home-footer.component';

import { UploadComponent } from './upload/upload.component';

import { AuthenService } from '../core/services/authen.service';
import { BaseEditorService } from '../base/base.service-editor';
import { BaseService } from '../base/base.service';
import { Title } from '@angular/platform-browser';
import { BaseExplorerService } from '../base/base.service-explorer';
import { PermissionResolve } from '../base/resolver';
import { BaseWidgetService } from '../base/base.service-widget';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    RouterModule.forChild(mainRoutes)
  ],
  declarations: [
    MainComponent,
    HomeControlSideBarComponent,
    HomeFooterComponent,
    HomeHeaderComponent,
    HomeSidebarComponent,
    UploadComponent
  ],
  providers: [
    AuthenService,
    BaseEditorService,
    BaseExplorerService,
    BaseWidgetService,
    BaseService,
    Title,
    PermissionResolve
  ]
})
export class MainModule { }
