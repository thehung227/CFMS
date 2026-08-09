import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedAllocSettlementComponent } from './approvedallocsettlement.component';
import { ApprovedAllocSettlementEditorComponent } from './approvedallocsettlement-editor/approvedallocsettlement-editor.component';
import { ApprovedAllocSettlementExplorerComponent } from './approvedallocsettlement-explorer/approvedallocsettlement-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedallocsettlementRoutes: Routes = [
    {
        path: '', component: ApprovedAllocSettlementComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedAllocSettlementExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedAllocSettlementEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedAllocSettlementEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedallocsettlementRoutes),
        UIModule
    ],
    declarations: [
        ApprovedAllocSettlementComponent,
        ApprovedAllocSettlementEditorComponent,
        ApprovedAllocSettlementExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedAllocSettlementComponent]
})

export class ApprovedAllocSettlementModule { }
