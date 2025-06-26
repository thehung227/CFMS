import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { DeadlineProjectPopupComponent } from './deadlineproject-popup.component';
import { DeadlineProjectPopupEditorComponent } from './deadlineproject-popup-editor/deadlineproject-popup-editor.component';


import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const deadlineprojectpopupRoutes: Routes = [
    {
        path: '', component: DeadlineProjectPopupComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            
            { path: 'detail', component: DeadlineProjectPopupEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: DeadlineProjectPopupEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(deadlineprojectpopupRoutes),
        UIModule
    ],
    declarations: [
        DeadlineProjectPopupComponent,
        DeadlineProjectPopupEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [DeadlineProjectPopupComponent]
})

export class DeadlineProjectPopupModule { }
