import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedSettlementClaimComponent } from './approvedsettlementclaim.component';
import { ApprovedSettlementClaimEditorComponent } from './approvedsettlementclaim-editor/approvedsettlementclaim-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedsettlementclaimRoutes: Routes = [
    {
        path: '', component: ApprovedSettlementClaimComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedSettlementClaimEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedSettlementClaimEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedsettlementclaimRoutes),
        UIModule
    ],
    declarations: [
        ApprovedSettlementClaimComponent,
        ApprovedSettlementClaimEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedSettlementClaimComponent]
})

export class ApprovedSettlementClaimModule { }
