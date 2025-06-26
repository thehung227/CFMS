import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RefreshTokenComponent } from './refreshtoken.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AuthenService } from '../core/services/authen.service';
import { BaseService } from '../base/base.service';

import { WjInputModule } from 'wijmo/wijmo.angular2.input';

export const routes: Routes = [
  { path: '', component: RefreshTokenComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    WjInputModule,
    RouterModule.forChild(routes)
  ],
  providers: [AuthenService, BaseService],
  declarations: [RefreshTokenComponent]
})
export class RefreshTokenModule { }
