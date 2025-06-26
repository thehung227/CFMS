import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { RegContractComponent } from './regcontract.component';
import { RegContractEditorComponent } from './regcontract-editor/regcontract-editor.component';
import { RegAppendixEditorComponent } from './regappendix-editor/regappendix-editor.component';
import { RegContractExplorerComponent } from './regcontract-explorer/regcontract-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { RegContractExplorerChildComponent } from './regcontract-explorer/regcontract-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const regcontractRoutes: Routes = [
    {
        path: '', component: RegContractComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: RegContractExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc3', component: RegContractEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc3/:id', component: RegContractEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc3/:id/:params', component: RegContractEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc4', component: RegAppendixEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc4/:id', component: RegAppendixEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc4/:id/:params', component: RegAppendixEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(regcontractRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        RegContractComponent,
        RegContractEditorComponent,
        RegAppendixEditorComponent,
        RegContractExplorerComponent,
        RegContractExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [RegContractComponent]
})

export class RegContractModule { }
