import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedSettlementComponent } from './approvedsettlement.component';
import { ApprovedSettlementEditorComponent } from './approvedsettlement-editor/approvedsettlement-editor.component';
import { ApprovedSettlementExplorerComponent } from './approvedsettlement-explorer/approvedsettlement-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedsettlementRoutes: Routes = [
    {
        path: '', component: ApprovedSettlementComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedSettlementExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedSettlementEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedSettlementEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedsettlementRoutes),
        UIModule
    ],
    declarations: [
        ApprovedSettlementComponent,
        ApprovedSettlementEditorComponent,
        ApprovedSettlementExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedSettlementComponent]
})

export class ApprovedSettlementModule { }
