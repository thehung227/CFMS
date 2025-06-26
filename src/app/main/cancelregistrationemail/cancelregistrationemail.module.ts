import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { CancelRegistrationEmailComponent } from './cancelregistrationemail.component';
import { CancelRegistrationEmailEditorComponent } from './cancelregistrationemail-editor/cancelregistrationemail-editor.component';
import { CancelRegistrationEmailExplorerComponent } from './cancelregistrationemail-explorer/cancelregistrationemail-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { CancelRegistrationEmailExplorerChildComponent } from './cancelregistrationemail-explorer/cancelregistrationemail-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const cancelregistrationemailRoutes: Routes = [
    {
        path: '', component: CancelRegistrationEmailComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: CancelRegistrationEmailExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: CancelRegistrationEmailEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: CancelRegistrationEmailEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: CancelRegistrationEmailEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(cancelregistrationemailRoutes),
        UIModule,
        WjGridModule,
        WjGridDetailModule,        
        WjGridFilterModule
    ],
    declarations: [
        CancelRegistrationEmailComponent,
        CancelRegistrationEmailEditorComponent,
        CancelRegistrationEmailExplorerComponent,
        CancelRegistrationEmailExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [CancelRegistrationEmailComponent]
})

export class CancelRegistrationEmailModule { }
