import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillPayDeptComponent } from './billpaydept.component';
import { BillPayDeptEditorComponent } from './billpaydept-editor/billpaydept-editor.component';
import { BillPayDeptExplorerComponent } from './billpaydept-explorer/billpaydept-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { BillPayDeptExplorerChildComponent } from './billpaydept-explorer/billpaydept-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billpaydeptRoutes: Routes = [
    {
        path: '', component: BillPayDeptComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillPayDeptExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillPayDeptEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillPayDeptEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billpaydeptRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        BillPayDeptComponent,
        BillPayDeptEditorComponent,
        BillPayDeptExplorerComponent,
        BillPayDeptExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillPayDeptComponent]
})

export class BillPayDeptModule { }
