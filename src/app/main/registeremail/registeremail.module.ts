import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { RegisterEmailComponent } from './registeremail.component';
import { RegisterEmailEditorComponent } from './registeremail-editor/registeremail-editor.component';
import { RegisterEmailExplorerComponent } from './registeremail-explorer/registeremail-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { RegisterEmailExplorerChildComponent } from './registeremail-explorer/registeremail-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const registeremailRoutes: Routes = [
    {
        path: '', component: RegisterEmailComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: RegisterEmailExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: RegisterEmailEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: RegisterEmailEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: RegisterEmailEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(registeremailRoutes),
        UIModule,
        WjGridModule,
        WjGridDetailModule,        
        WjGridFilterModule
    ],
    declarations: [
        RegisterEmailComponent,
        RegisterEmailEditorComponent,
        RegisterEmailExplorerComponent,
        RegisterEmailExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [RegisterEmailComponent]
})

export class RegisterEmailModule { }
