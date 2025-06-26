import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { RegisterUserComponent } from './registeruser.component';
import { RegisterUserEditorComponent } from './registeruser-editor/registeruser-editor.component';
import { RegisterUserExplorerComponent } from './registeruser-explorer/registeruser-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { RegisterUserExplorerChildComponent } from './registeruser-explorer/registeruser-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const registeruserRoutes: Routes = [
    {
        path: '', component: RegisterUserComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: RegisterUserExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: RegisterUserEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: RegisterUserEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: RegisterUserEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(registeruserRoutes),
        UIModule,
        WjGridModule,
        WjGridDetailModule,        
        WjGridFilterModule
    ],
    declarations: [
        RegisterUserComponent,
        RegisterUserEditorComponent,
        RegisterUserExplorerComponent,
        RegisterUserExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [RegisterUserComponent]
})

export class RegisterUserModule { }
