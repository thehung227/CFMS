import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedProposalRevenueExpenComponent } from './approvedproposalrevenueexpen.component';
import { ApprovedProposalRevenueExpenEditorComponent } from './approvedproposalrevenueexpen-editor/approvedproposalrevenueexpen-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedproposalrevenueexpenRoutes: Routes = [
    {
        path: '', component: ApprovedProposalRevenueExpenComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedProposalRevenueExpenEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedProposalRevenueExpenEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedproposalrevenueexpenRoutes),
        UIModule
    ],
    declarations: [
        ApprovedProposalRevenueExpenComponent,
        ApprovedProposalRevenueExpenEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedProposalRevenueExpenComponent]
})

export class ApprovedProposalRevenueExpenModule { }
