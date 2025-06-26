import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmProfileComponent } from './confirmprofile.component';
import { ConfirmProfileEditorComponent } from './confirmprofile-editor/confirmprofile-editor.component';
import { ConfirmProfileExplorerComponent } from './confirmprofile-explorer/confirmprofile-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { ConfirmProfileExplorerChildComponent } from './confirmprofile-explorer/confirmprofile-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const confirmprofileRoutes: Routes = [
    {
        path: '', component: ConfirmProfileComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ConfirmProfileExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ConfirmProfileEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ConfirmProfileEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ConfirmProfileEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(confirmprofileRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        ConfirmProfileComponent,
        ConfirmProfileEditorComponent,
        ConfirmProfileExplorerComponent,
        ConfirmProfileExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ConfirmProfileComponent]
})

export class ConfirmProfileModule { }
