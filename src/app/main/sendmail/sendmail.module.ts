import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SendMailComponent } from './sendmail.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { WjInputModule } from 'wijmo/wijmo.angular2.input';
import { AuthenService } from '../../core/services/authen.service';
import { BaseService } from '../../base/base.service';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { LoginModule } from '../../login/login.module';
import { LoginComponent } from '../../login/login.component';

export const sendMailRoutes: Routes = [
  { path: '', component: SendMailComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    WjInputModule,
    RouterModule.forChild(sendMailRoutes)
  ],
  
  providers: [AuthenService, BaseService,BaseExplorerService],
  declarations: [SendMailComponent]
})
export class SendMailModule { }
