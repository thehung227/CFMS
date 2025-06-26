import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { RegContractAttachComponent } from './regcontractattach.component';
import { RegContractAttachEditorComponent } from './regcontractattach-editor/regcontractattach-editor.component';
import { RegContractAttachExplorerComponent } from './regcontractattach-explorer/regcontractattach-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { RegContractAttachExplorerChildComponent } from './regcontractattach-explorer/regcontractattach-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const regcontractattachRoutes: Routes = [
    {
        path: '', component: RegContractAttachComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: RegContractAttachExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: RegContractAttachEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: RegContractAttachEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: RegContractAttachEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(regcontractattachRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        RegContractAttachComponent,
        RegContractAttachEditorComponent,
        RegContractAttachExplorerComponent,
        RegContractAttachExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [RegContractAttachComponent]
})

export class RegContractAttachModule { }
