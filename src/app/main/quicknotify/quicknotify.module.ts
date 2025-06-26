import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { QuickNotifyComponent } from './quicknotify.component';

import { QuickNotifyService } from './quicknotify.service';
import { InputControlService } from './../../ui/input/InputControlService';

const reporterRoutes: Routes = [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: QuickNotifyComponent },
    { path: 'view/:id', component: QuickNotifyComponent }
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(reporterRoutes),
        UIModule
    ],
    declarations: [
        QuickNotifyComponent
    ],
    providers: [
        QuickNotifyService,
        InputControlService
    ],
    exports: [QuickNotifyComponent]
})

export class QuickNotifyModule { }