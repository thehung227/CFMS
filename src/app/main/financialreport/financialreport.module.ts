import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { FinancialReportComponent } from './financialreport.component';
import { FinancialReportEditorComponent } from './financialreport-editor/financialreport-editor.component';
import { FinancialReportExplorerComponent } from './financialreport-explorer/financialreport-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { FinancialReportExplorerChildComponent } from './financialreport-explorer/financialreport-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const financialreportRoutes: Routes = [
    {
        path: '', component: FinancialReportComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: FinancialReportExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: FinancialReportEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: FinancialReportEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: FinancialReportEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(financialreportRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        FinancialReportComponent,
        FinancialReportEditorComponent,
        FinancialReportExplorerComponent,
        FinancialReportExplorerChildComponent,
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [FinancialReportComponent]
})

export class FinancialReportModule { }
