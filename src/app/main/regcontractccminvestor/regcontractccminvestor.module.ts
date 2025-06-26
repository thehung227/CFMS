import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { RegContractCcmInvestorComponent } from './regcontractccminvestor.component';
import { RegContractCcmInvestorEditorComponent } from './regcontractccminvestor-editor/regcontractccminvestor-editor.component';
import { RegContractCcmInvestorExplorerComponent } from './regcontractccminvestor-explorer/regcontractccminvestor-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { RegContractCcmInvestorExplorerChildComponent } from './regcontractccminvestor-explorer/regcontractccminvestor-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const regcontractccminvestorRoutes: Routes = [
    {
        path: '', component: RegContractCcmInvestorComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: RegContractCcmInvestorExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: RegContractCcmInvestorEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: RegContractCcmInvestorEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: RegContractCcmInvestorEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(regcontractccminvestorRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        RegContractCcmInvestorComponent,
        RegContractCcmInvestorEditorComponent,
        RegContractCcmInvestorExplorerComponent,
        RegContractCcmInvestorExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [RegContractCcmInvestorComponent]
})

export class RegContractCcmInvestorModule { }
