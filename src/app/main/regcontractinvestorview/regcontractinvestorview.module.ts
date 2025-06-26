import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { RegContractInvestorViewComponent } from './regcontractinvestorview.component';
import { RegContractInvestorViewEditorComponent } from './regcontractinvestorview-editor/regcontractinvestorview-editor.component';
import { RegContractInvestorViewExplorerComponent } from './regcontractinvestorview-explorer/regcontractinvestorview-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { RegContractInvestorViewExplorerChildComponent } from './regcontractinvestorview-explorer/regcontractinvestorview-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const regcontractinvestorviewRoutes: Routes = [
    {
        path: '', component: RegContractInvestorViewComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: RegContractInvestorViewExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: RegContractInvestorViewEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: RegContractInvestorViewEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: RegContractInvestorViewEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(regcontractinvestorviewRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        RegContractInvestorViewComponent,
        RegContractInvestorViewEditorComponent,
        RegContractInvestorViewExplorerComponent,
        RegContractInvestorViewExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [RegContractInvestorViewComponent]
})

export class RegContractInvestorViewModule { }
